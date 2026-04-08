-- Schema v2: SEO + Google Jobs Compatibility
-- Applied to live database on 2026-04-08
--
-- Company changes:
--   + size (Google Jobs numberOfEmployees)
--   + createdBy (admin who added company)
--   - tagline, userId, organizationType (removed)
--
-- Job changes:
--   + publishedAt (CRITICAL: Google Jobs datePosted)
--   + featuredImage, industry, viewCount, applicantCount, createdBy
--   - applicationUrl, applicationEmail, source (removed)
--
-- Opportunity changes:
--   + featuredImage, createdBy
--   - category, provider, value, currency, targetAudience,
--     fieldOfInterest, source, sourceUrl, externalApplyUrl,
--     opportunityCount (removed)

-- ========================================
-- DROP FOREIGN KEYS & INDEXES
-- ========================================
ALTER TABLE `companies` DROP FOREIGN KEY `companies_userId_fkey`;
DROP INDEX `companies_userId_key` ON `companies`;
DROP INDEX `opportunities_category_idx` ON `opportunities`;

-- ========================================
-- COMPANIES
-- ========================================
ALTER TABLE `companies`
  DROP COLUMN `organizationType`,
  DROP COLUMN `tagline`,
  DROP COLUMN `userId`,
  ADD COLUMN `createdBy` VARCHAR(191) NULL,
  ADD COLUMN `size` VARCHAR(191) NULL;

-- ========================================
-- JOBS
-- ========================================
ALTER TABLE `jobs`
  DROP COLUMN `application_email`,
  DROP COLUMN `application_url`,
  DROP COLUMN `source`,
  ADD COLUMN `applicant_count` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `createdBy` VARCHAR(191) NULL,
  ADD COLUMN `featured_image` VARCHAR(191) NULL,
  ADD COLUMN `industry` VARCHAR(191) NULL,
  ADD COLUMN `published_at` DATETIME(3) NULL,
  ADD COLUMN `view_count` INTEGER NOT NULL DEFAULT 0,
  ALTER COLUMN `country` DROP DEFAULT,
  MODIFY `salary_period` VARCHAR(191) NOT NULL DEFAULT 'Monthly';

-- ========================================
-- OPPORTUNITIES
-- ========================================
ALTER TABLE `opportunities`
  DROP COLUMN `category`,
  DROP COLUMN `externalApplyUrl`,
  DROP COLUMN `fieldOfInterest`,
  DROP COLUMN `opportunityCount`,
  DROP COLUMN `source`,
  DROP COLUMN `sourceUrl`,
  DROP COLUMN `targetAudience`,
  ADD COLUMN `createdBy` VARCHAR(191) NULL,
  ADD COLUMN `featured_image` VARCHAR(191) NULL;

-- ========================================
-- NEW INDEXES
-- ========================================
CREATE INDEX `jobs_industry_idx` ON `jobs`(`industry`);
CREATE INDEX `jobs_createdBy_idx` ON `jobs`(`createdBy`);
CREATE INDEX `jobs_is_active_published_at_idx` ON `jobs`(`is_active`, `published_at`);
CREATE INDEX `opportunities_createdBy_idx` ON `opportunities`(`createdBy`);

-- ========================================
-- NEW FOREIGN KEYS
-- ========================================
ALTER TABLE `companies` ADD CONSTRAINT `companies_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `opportunities` ADD CONSTRAINT `opportunities_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ========================================
-- INDEX RENAMES (snake_case alignment)
-- ========================================
CREATE INDEX `jobs_experience_level_idx` ON `jobs`(`experience_level`);
DROP INDEX `jobs_experienceLevel_idx` ON `jobs`;
CREATE INDEX `jobs_is_active_idx` ON `jobs`(`is_active`);
DROP INDEX `jobs_isActive_publishedAt_idx` ON `jobs`;
CREATE INDEX `jobs_is_featured_idx` ON `jobs`(`is_featured`);
DROP INDEX `jobs_isFeatured_idx` ON `jobs`;
CREATE INDEX `jobs_employment_type_idx` ON `jobs`(`employment_type`);
DROP INDEX `jobs_jobType_idx` ON `jobs`;
