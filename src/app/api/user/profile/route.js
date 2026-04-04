import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  isPlaceholderEmail,
  isProfileComplete,
  getMissingProfileFields,
  linkWalkInOrders,
} from "@/lib/account-merge";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        profileComplete: true,
        createdAt: true,
        authAccounts: {
          select: { provider: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const missingFields = getMissingProfileFields(user);
    const hasPassword = await db.authAccount.findFirst({
      where: { userId: user.id, provider: "email" },
    });

    return NextResponse.json({
      user,
      missingFields,
      authProviders: user.authAccounts.map((a) => a.provider),
      hasPassword: !!hasPassword,
    });
  } catch (error) {
    console.error("[Profile API] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, password } = body;

    // Find current user
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData = {};

    // --- Update Name ---
    if (name && typeof name === "string" && name.trim().length >= 2) {
      updateData.name = name.trim();
    }

    // --- Update Email ---
    if (email && typeof email === "string") {
      const trimmedEmail = email.toLowerCase().trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        if (trimmedEmail !== currentUser.email) {
          // Check if another user has this email
          const existingEmailUser = await db.user.findUnique({
            where: { email: trimmedEmail },
          });

          if (existingEmailUser && existingEmailUser.id !== currentUser.id) {
            // MERGE: another user has this email — merge them
            console.log(
              `[Profile] Merging accounts: current=${currentUser.id} + emailUser=${existingEmailUser.id}`
            );

            const [keeper, absorbed] =
              currentUser.createdAt <= existingEmailUser.createdAt
                ? [currentUser, existingEmailUser]
                : [existingEmailUser, currentUser];

            // Transfer data from absorbed to keeper
            const mergeData = {};
            if (!keeper.phone && absorbed.phone) mergeData.phone = absorbed.phone;
            if (!keeper.name || keeper.name === "Phone User")
              mergeData.name = absorbed.name;
            if (!keeper.passwordHash && absorbed.passwordHash)
              mergeData.passwordHash = absorbed.passwordHash;
            if (!keeper.avatar && absorbed.avatar)
              mergeData.avatar = absorbed.avatar;
            if (absorbed.emailVerified && !keeper.emailVerified)
              mergeData.emailVerified = true;
            if (absorbed.phoneVerified && !keeper.phoneVerified)
              mergeData.phoneVerified = true;
            mergeData.email = trimmedEmail;

            // Transfer orders
            await db.order.updateMany({
              where: { userId: absorbed.id },
              data: { userId: keeper.id },
            });

            // Transfer auth accounts
            await db.authAccount.updateMany({
              where: { userId: absorbed.id },
              data: { userId: keeper.id },
            });

            // Transfer other relations
            for (const model of [
              "savedJob",
              "savedArticle",
              "jobAlert",
              "notification",
              "application",
            ]) {
              try {
                await db[model].updateMany({
                  where: { userId: absorbed.id },
                  data: { userId: keeper.id },
                });
              } catch (e) {
                console.error(
                  `[Profile] Failed to transfer ${model}:`,
                  e.message
                );
              }
            }

            // Update keeper
            const updatedKeeper = await db.user.update({
              where: { id: keeper.id },
              data: mergeData,
            });

            // Delete absorbed
            try {
              await db.user.delete({ where: { id: absorbed.id } });
            } catch (e) {
              console.error(
                `[Profile] Could not delete absorbed user:`,
                e.message
              );
            }

            // Recompute profileComplete
            const complete = isProfileComplete(updatedKeeper);
            await db.user.update({
              where: { id: updatedKeeper.id },
              data: { profileComplete: complete },
            });

            // Link walk-in orders
            await linkWalkInOrders(
              updatedKeeper.id,
              trimmedEmail,
              updatedKeeper.phone
            );

            const { passwordHash: _, ...userWithoutPassword } = updatedKeeper;
            return NextResponse.json({
              message: "Profile updated and accounts merged",
              user: userWithoutPassword,
              profileComplete: complete,
              merged: true,
            });
          }

          // No conflict — just update email
          updateData.email = trimmedEmail;
          updateData.emailVerified = false; // require re-verification
        }
      }
    }

    // --- Update Phone ---
    if (phone && typeof phone === "string") {
      let normalizedPhone = phone.replace(/[\s\-\+]/g, "");
      if (normalizedPhone.startsWith("0")) {
        normalizedPhone = "254" + normalizedPhone.substring(1);
      }
      if (
        /^254\d{9}$/.test(normalizedPhone) &&
        normalizedPhone !== currentUser.phone
      ) {
        // Check if another user has this phone
        const existingPhoneUser = await db.user.findUnique({
          where: { phone: normalizedPhone },
        });

        if (existingPhoneUser && existingPhoneUser.id !== currentUser.id) {
          return NextResponse.json(
            {
              error:
                "This phone number is already linked to another account. Please contact support.",
            },
            { status: 409 }
          );
        }

        updateData.phone = normalizedPhone;
        updateData.phoneVerified = false; // will need OTP verification
      }
    }

    // --- Set Password ---
    if (password && typeof password === "string" && password.length >= 8) {
      const saltRounds = 12;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);

      // Create email auth account if not exists
      const existingAuth = await db.authAccount.findFirst({
        where: { userId: session.user.id, provider: "email" },
      });
      if (!existingAuth && updateData.email) {
        await db.authAccount.create({
          data: {
            userId: session.user.id,
            provider: "email",
            providerAccountId: updateData.email || currentUser.email,
          },
        });
      } else if (existingAuth && updateData.email) {
        await db.authAccount.update({
          where: { id: existingAuth.id },
          data: { providerAccountId: updateData.email },
        });
      }
    }

    // Apply updates
    let updatedUser = currentUser;
    if (Object.keys(updateData).length > 0) {
      updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: updateData,
      });
    }

    // Recompute profileComplete
    const complete = isProfileComplete(updatedUser);
    if (complete !== updatedUser.profileComplete) {
      updatedUser = await db.user.update({
        where: { id: updatedUser.id },
        data: { profileComplete: complete },
      });
    }

    // Link walk-in orders with new email/phone
    if (updateData.email || updateData.phone) {
      await linkWalkInOrders(updatedUser.id, updatedUser.email, updatedUser.phone);
    }

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
      profileComplete: updatedUser.profileComplete,
    });
  } catch (error) {
    console.error("[Profile API] PUT error:", error);

    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "email") {
        return NextResponse.json(
          { error: "This email is already in use" },
          { status: 409 }
        );
      }
      if (field === "phone") {
        return NextResponse.json(
          { error: "This phone number is already in use" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
