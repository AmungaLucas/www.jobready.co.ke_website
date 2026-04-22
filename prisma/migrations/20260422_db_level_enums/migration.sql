-- ============================================================
-- Migration: DB-Level Enums (v3)
-- Date: 2026-04-22
-- Description: Convert all string-validated enum fields to MySQL ENUM columns.
--   - 29 ENUM types
--   - Normalized lowercase values to UPPER_SNAKE_CASE
--   - CompanySize: "1-10"→SIZE_1_10, "1000+"→SIZE_1000_PLUS
--   - Shared enums: JobStatus, EmploymentType, OrganizationIndustry
--   - Added CORPORATE to OrganizationType for existing data
--   - Added SIZE_5000_10000, SIZE_10000_PLUS to CompanySize for existing data
--   - Added COMPLETED, SUBSCRIPTION to Payment enums for existing data
--
-- IMPORTANT: This migration includes data conversion steps.
--   1. First convert existing data to new UPPER_SNAKE_CASE values
--   2. Then ALTER columns to ENUM type
--
-- NOTE: Column names are EXACTLY as they exist in MySQL.
--   Some use camelCase (e.g. reactionType, jobType, paymentStatus),
--   others use snake_case (e.g. employment_type, organization_type).
--   This matches how Prisma created them (with or without @map).
-- ============================================================

-- ── Step 1: Convert existing data to new enum values ──────────

-- AuthProvider: lowercase → UPPERCASE
UPDATE `auth_accounts` SET `provider` = 'GOOGLE' WHERE `provider` = 'google';
UPDATE `auth_accounts` SET `provider` = 'EMAIL' WHERE `provider` = 'email';
UPDATE `auth_accounts` SET `provider` = 'PHONE' WHERE `provider` = 'phone';
UPDATE `auth_accounts` SET `provider` = 'RESET' WHERE `provider` = 'reset';

-- OtpPurpose: lowercase → UPPERCASE + cleanup invalid values
UPDATE `otps` SET `purpose` = 'AUTH' WHERE `purpose` = 'auth';
UPDATE `otps` SET `purpose` = 'RESET' WHERE `purpose` = 'reset';
UPDATE `otps` SET `purpose` = 'VERIFY' WHERE `purpose` = 'verify';
UPDATE `otps` SET `purpose` = 'EMAIL_LINK' WHERE `purpose` = 'email_link';
UPDATE `otps` SET `purpose` = 'SESSION_GRANT' WHERE `purpose` = 'session_grant';
UPDATE `otps` SET `purpose` = 'EMAIL_UPDATE' WHERE `purpose` = 'email_update';
UPDATE `otps` SET `purpose` = 'EMAIL_VERIFY' WHERE `purpose` = 'email_verify';
UPDATE `otps` SET `purpose` = 'PHONE_VERIFY' WHERE `purpose` = 'phone_verify';
UPDATE `otps` SET `purpose` = 'ACCOUNT_DELETE' WHERE `purpose` = 'account_delete';
-- Fix invalid OTP purpose values (e.g. rate-limit keys that leaked in)
UPDATE `otps` SET `purpose` = 'AUTH' WHERE `purpose` NOT IN ('AUTH','RESET','VERIFY','EMAIL_LINK','SESSION_GRANT','EMAIL_UPDATE','EMAIL_VERIFY','PHONE_VERIFY','ACCOUNT_DELETE');

-- CompanySize: special chars → valid identifiers
UPDATE `companies` SET `size` = 'SIZE_1_10' WHERE `size` = '1-10';
UPDATE `companies` SET `size` = 'SIZE_11_50' WHERE `size` = '11-50';
UPDATE `companies` SET `size` = 'SIZE_51_200' WHERE `size` = '51-200';
UPDATE `companies` SET `size` = 'SIZE_201_500' WHERE `size` = '201-500';
UPDATE `companies` SET `size` = 'SIZE_501_1000' WHERE `size` = '501-1000';
UPDATE `companies` SET `size` = 'SIZE_1000_PLUS' WHERE `size` = '1000+';
UPDATE `companies` SET `size` = 'SIZE_5000_10000' WHERE `size` = '5000-10000';
UPDATE `companies` SET `size` = 'SIZE_10000_PLUS' WHERE `size` = '10000+';

-- Company.organization_type: map existing data
UPDATE `companies` SET `organization_type` = 'PRIVATE' WHERE `organization_type` = 'CORPORATE';

-- Company.industry: map human-readable to UPPER_SNAKE_CASE
UPDATE `companies` SET `industry` = 'BANKING' WHERE `industry` = 'Banking & Financial Services';
UPDATE `companies` SET `industry` = 'TELECOMMUNICATIONS' WHERE `industry` = 'Telecommunications';
-- CONSULTING already matches

-- ReactionType: lowercase → UPPERCASE (column is camelCase: reactionType)
UPDATE `article_reactions` SET `reactionType` = 'HELPFUL' WHERE `reactionType` = 'helpful';
UPDATE `article_reactions` SET `reactionType` = 'LOVE' WHERE `reactionType` = 'love';
UPDATE `article_reactions` SET `reactionType` = 'INSIGHTFUL' WHERE `reactionType` = 'insightful';
UPDATE `article_reactions` SET `reactionType` = 'MIND_BLOWING' WHERE `reactionType` = 'mind_blowing';

-- NewsletterType: lowercase → UPPERCASE
UPDATE `newsletter_subscriptions` SET `type` = 'CAREER_TIPS' WHERE `type` = 'career_tips';
UPDATE `newsletter_subscriptions` SET `type` = 'JOB_ALERTS' WHERE `type` = 'job_alerts';
UPDATE `newsletter_subscriptions` SET `type` = 'OPPORTUNITY_ALERTS' WHERE `type` = 'opportunity_alerts';
UPDATE `newsletter_subscriptions` SET `type` = 'EMPLOYER_UPDATES' WHERE `type` = 'employer_updates';

-- WhatsAppContext: lowercase → UPPERCASE
UPDATE `whatsapp_clicks` SET `context` = 'APPLY_BUTTON' WHERE `context` = 'apply_button';
UPDATE `whatsapp_clicks` SET `context` = 'SERVICE_INQUIRY' WHERE `context` = 'service_inquiry';
UPDATE `whatsapp_clicks` SET `context` = 'FLOAT_BUTTON' WHERE `context` = 'float_button';

-- Payment.status: map COMPLETED → SUCCESS for M-Pesa context
-- NOTE: payments table also has company subscription payments; we add COMPLETED to enum
-- to preserve existing data while supporting both use cases
-- (COMPLETED is for subscription payments, SUCCESS for M-Pesa payments)

-- ── Step 2: ALTER columns to ENUM types ──────────────────────

-- User.role → UserRole ENUM
ALTER TABLE `users` MODIFY COLUMN `role` ENUM('JOB_SEEKER', 'EMPLOYER', 'ADMIN') NOT NULL DEFAULT 'JOB_SEEKER';

-- AuthAccount.provider → AuthProvider ENUM
ALTER TABLE `auth_accounts` MODIFY COLUMN `provider` ENUM('GOOGLE', 'EMAIL', 'PHONE', 'RESET') NOT NULL;

-- Otp.purpose → OtpPurpose ENUM
ALTER TABLE `otps` MODIFY COLUMN `purpose` ENUM('AUTH', 'RESET', 'VERIFY', 'EMAIL_LINK', 'SESSION_GRANT', 'EMAIL_UPDATE', 'EMAIL_VERIFY', 'PHONE_VERIFY', 'ACCOUNT_DELETE') NOT NULL DEFAULT 'AUTH';

-- Company.organizationType → OrganizationType ENUM (added CORPORATE)
ALTER TABLE `companies` MODIFY COLUMN `organization_type` ENUM('PRIVATE', 'SMALL_BUSINESS', 'STARTUP', 'CORPORATE', 'NGO', 'INTERNATIONAL_ORG', 'NATIONAL_GOV', 'COUNTY_GOV', 'STATE_CORPORATION', 'EDUCATION', 'FOUNDATION', 'RELIGIOUS_ORG');

-- Company.industry → OrganizationIndustry ENUM
ALTER TABLE `companies` MODIFY COLUMN `industry` ENUM('AGRICULTURE', 'AUTOMOTIVE', 'AVIATION', 'BANKING', 'CONSTRUCTION', 'CONSULTING', 'CONSUMER_GOODS', 'EDUCATION', 'ENERGY', 'ENVIRONMENT', 'FINTECH', 'FOOD_BEVERAGE', 'GOVERNMENT_PUBLIC_ADMIN', 'HEALTHCARE', 'HOSPITALITY_TOURISM', 'HUMAN_RESOURCES', 'INFORMATION_TECHNOLOGY', 'INSURANCE', 'INTERNATIONAL_DEVELOPMENT', 'LEGAL', 'LOGISTICS_SUPPLY_CHAIN', 'MANUFACTURING', 'MARKETING_ADVERTISING', 'MEDIA_ENTERTAINMENT', 'MINING', 'NON_PROFIT', 'PHARMACEUTICAL', 'REAL_ESTATE', 'RESEARCH', 'RETAIL', 'SECURITY_DEFENSE', 'SPORTS', 'TELECOMMUNICATIONS', 'TEXTILES_APPAREL', 'WATER_SANITATION') NOT NULL;

-- Company.size → CompanySize ENUM (added SIZE_5000_10000, SIZE_10000_PLUS)
ALTER TABLE `companies` MODIFY COLUMN `size` ENUM('SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_501_1000', 'SIZE_1000_PLUS', 'SIZE_5000_10000', 'SIZE_10000_PLUS');

-- Job.employmentType → EmploymentType ENUM
ALTER TABLE `jobs` MODIFY COLUMN `employment_type` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'VOLUNTEER', 'FREELANCE', 'PERMANENT') NOT NULL;

-- Job.experienceLevel → ExperienceLevel ENUM
ALTER TABLE `jobs` MODIFY COLUMN `experience_level` ENUM('ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR', 'EXECUTIVE') NOT NULL;

-- Job.salaryPeriod → SalaryPeriod ENUM
ALTER TABLE `jobs` MODIFY COLUMN `salary_period` ENUM('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY') NOT NULL DEFAULT 'MONTHLY';

-- Job.industry → OrganizationIndustry ENUM (nullable)
ALTER TABLE `jobs` MODIFY COLUMN `industry` ENUM('AGRICULTURE', 'AUTOMOTIVE', 'AVIATION', 'BANKING', 'CONSTRUCTION', 'CONSULTING', 'CONSUMER_GOODS', 'EDUCATION', 'ENERGY', 'ENVIRONMENT', 'FINTECH', 'FOOD_BEVERAGE', 'GOVERNMENT_PUBLIC_ADMIN', 'HEALTHCARE', 'HOSPITALITY_TOURISM', 'HUMAN_RESOURCES', 'INFORMATION_TECHNOLOGY', 'INSURANCE', 'INTERNATIONAL_DEVELOPMENT', 'LEGAL', 'LOGISTICS_SUPPLY_CHAIN', 'MANUFACTURING', 'MARKETING_ADVERTISING', 'MEDIA_ENTERTAINMENT', 'MINING', 'NON_PROFIT', 'PHARMACEUTICAL', 'REAL_ESTATE', 'RESEARCH', 'RETAIL', 'SECURITY_DEFENSE', 'SPORTS', 'TELECOMMUNICATIONS', 'TEXTILES_APPAREL', 'WATER_SANITATION');

-- Job.status → JobStatus ENUM
ALTER TABLE `jobs` MODIFY COLUMN `status` ENUM('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED', 'FILLED', 'EXPIRED') NOT NULL DEFAULT 'DRAFT';

-- Opportunity.opportunityType → OpportunityType ENUM (camelCase column)
ALTER TABLE `opportunities` MODIFY COLUMN `opportunityType` ENUM('INTERNSHIP', 'SPONSORSHIP', 'BURSARY', 'SCHOLARSHIP', 'UNIVERSITY_ADMISSION', 'VOLUNTEER', 'TRAINING', 'GRANT', 'CERTIFICATION', 'FUNDING', 'FELLOWSHIP', 'APPRENTICESHIP', 'WORKSHOP', 'CONFERENCE', 'COMPETITION', 'AWARD', 'RESIDENCY', 'MENTORSHIP', 'ACCELERATOR', 'INCUBATOR', 'BOOTCAMP', 'EXCHANGE', 'RESEARCH') NOT NULL;

-- Opportunity.status → JobStatus ENUM (shared with Job)
ALTER TABLE `opportunities` MODIFY COLUMN `status` ENUM('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED', 'FILLED', 'EXPIRED') NOT NULL DEFAULT 'DRAFT';

-- SitePage.status → SitePageStatus ENUM
ALTER TABLE `site_pages` MODIFY COLUMN `status` ENUM('PUBLISHED', 'DRAFT', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT';

-- Faq.category → FaqCategory ENUM
ALTER TABLE `faqs` MODIFY COLUMN `category` ENUM('SERVICES', 'PAYMENTS', 'PRIVACY', 'GENERAL');

-- JobAlert.jobType → EmploymentType ENUM (nullable, camelCase column)
ALTER TABLE `job_alerts` MODIFY COLUMN `jobType` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'VOLUNTEER', 'FREELANCE', 'PERMANENT');

-- ArticleReaction.reactionType → ReactionType ENUM (camelCase column)
ALTER TABLE `article_reactions` MODIFY COLUMN `reactionType` ENUM('HELPFUL', 'LOVE', 'INSIGHTFUL', 'MIND_BLOWING') NOT NULL;

-- Notification.type → NotificationType ENUM
ALTER TABLE `notifications` MODIFY COLUMN `type` ENUM('ORDER_UPDATE', 'JOB_MATCH', 'PAYMENT', 'SYSTEM') NOT NULL;

-- ServiceTier.serviceType → ServiceType ENUM (camelCase column)
ALTER TABLE `service_tiers` MODIFY COLUMN `serviceType` ENUM('CV_WRITING', 'COVER_LETTER', 'LINKEDIN_PROFILE') NOT NULL;

-- ServiceTier.tier → ServiceTierLevel ENUM
ALTER TABLE `service_tiers` MODIFY COLUMN `tier` ENUM('BASIC', 'PROFESSIONAL', 'PREMIUM') NOT NULL;

-- Order.status → OrderStatus ENUM
ALTER TABLE `orders` MODIFY COLUMN `status` ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'DELIVERED', 'REVISION', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- Order.paymentStatus → PaymentStatus ENUM (camelCase column)
ALTER TABLE `orders` MODIFY COLUMN `paymentStatus` ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'UNPAID';

-- Payment.status → MpesaPaymentStatus ENUM (added COMPLETED for subscription payments)
ALTER TABLE `payments` MODIFY COLUMN `status` ENUM('PENDING', 'SUCCESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- OrderActivity.action → OrderActivityAction ENUM
ALTER TABLE `order_activity` MODIFY COLUMN `action` ENUM('STATUS_CHANGE', 'PAYMENT_RECEIVED', 'NOTE_ADDED') NOT NULL;

-- DataRequest.requestType → DataRequestType ENUM (camelCase column)
ALTER TABLE `data_requests` MODIFY COLUMN `requestType` ENUM('ACCESS', 'CORRECTION', 'DELETION', 'OBJECTION', 'PORTABILITY') NOT NULL;

-- DataRequest.status → DataRequestStatus ENUM
ALTER TABLE `data_requests` MODIFY COLUMN `status` ENUM('RECEIVED', 'PROCESSING', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'RECEIVED';

-- PageView.pageType → PageType ENUM (camelCase column)
ALTER TABLE `page_views` MODIFY COLUMN `pageType` ENUM('JOB', 'ARTICLE', 'COMPANY', 'OPPORTUNITY', 'HUB', 'BLOG') NOT NULL;

-- WhatsAppClick.pageType → WhatsAppPageType ENUM (camelCase column)
ALTER TABLE `whatsapp_clicks` MODIFY COLUMN `pageType` ENUM('JOB', 'SERVICE', 'HOMEPAGE', 'OPPORTUNITY', 'BLOG', 'COMPANY', 'CV_SERVICES') NOT NULL;

-- WhatsAppClick.context → WhatsAppContext ENUM
ALTER TABLE `whatsapp_clicks` MODIFY COLUMN `context` ENUM('APPLY_BUTTON', 'SERVICE_INQUIRY', 'FLOAT_BUTTON');

-- NewsletterSubscription.type → NewsletterType ENUM
ALTER TABLE `newsletter_subscriptions` MODIFY COLUMN `type` ENUM('CAREER_TIPS', 'JOB_ALERTS', 'OPPORTUNITY_ALERTS', 'EMPLOYER_UPDATES') NOT NULL DEFAULT 'CAREER_TIPS';

-- Application.status → ApplicationStatus ENUM
ALTER TABLE `applications` MODIFY COLUMN `status` ENUM('PENDING', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED') NOT NULL DEFAULT 'PENDING';

-- ── Step 3: Create AdPlacement table (not yet in DB) ──────────
CREATE TABLE IF NOT EXISTS `ad_placements` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `position` ENUM('HOME_TOP', 'SIDEBAR_1', 'ARTICLE_INLINE', 'SEARCH_TOP') NOT NULL,
  `adCode` MEDIUMTEXT NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `impressionCount` INT NOT NULL DEFAULT 0,
  `clickCount` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `ad_placements_position_idx` (`position`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
