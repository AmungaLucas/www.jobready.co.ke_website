-- Fix: Google OAuth tokens exceed VARCHAR(191) limit
-- accessToken, refreshToken, idToken, scope columns need TEXT type
-- to accommodate Google OAuth token lengths

ALTER TABLE `auth_accounts` MODIFY COLUMN `accessToken` TEXT NULL;
ALTER TABLE `auth_accounts` MODIFY COLUMN `refreshToken` TEXT NULL;
ALTER TABLE `auth_accounts` MODIFY COLUMN `idToken` TEXT NULL;
ALTER TABLE `auth_accounts` MODIFY COLUMN `scope` TEXT NULL;
