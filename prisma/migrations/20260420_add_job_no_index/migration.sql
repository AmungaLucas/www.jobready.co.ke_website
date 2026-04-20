-- Add no_index column to jobs table (SEO: per-job noindex control)
-- Added to schema but migration was missed in earlier commits.
-- Used by: jobs/[...slug]/page.jsx generateMetadata() to honor individual noIndex flags.
-- Safe to re-run: uses IF NOT EXISTS equivalent via procedure.

SET @dbname = DATABASE();
SET @tablename = 'jobs';
SET @columnname = 'no_index';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  'ALTER TABLE `jobs` ADD COLUMN `no_index` BOOLEAN NOT NULL DEFAULT FALSE;'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;
