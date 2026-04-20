-- Restore organizationType column (dropped by v2 migration but still needed by codebase)
-- Used by: organization type pages (NGOs, startups, government, etc.), filter parser,
-- organization sitemap, and company profile queries.

ALTER TABLE `companies`
  ADD COLUMN `organization_type` VARCHAR(191) NULL;

CREATE INDEX `companies_organization_type_idx` ON `companies`(`organization_type`);
