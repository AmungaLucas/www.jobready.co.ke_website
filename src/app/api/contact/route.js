import { NextResponse } from "next/server";

/**
 * POST /api/contact
 * Handles contact form submissions.
 * Body: { name, email, subject, message }
 *
 * In production, this would:
 * - Send an email to support@jobready.co.ke
 * - Store in a database table
 * - Integrate with a CRM/ticketing system
 *
 * For now, it validates input and returns success.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name is required and must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Trim message length
    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    // In production: send email, store in DB, create ticket
    // For now, log and return success
    console.log("[POST /api/contact] New contact form submission:", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      messageLength: message.trim().length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: "Your message has been received. We'll get back to you within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/contact] Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
