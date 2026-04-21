-- Add no_index column to jobs table
-- Purpose: per-job noindex control via admin API, dashboard toggle, or cron jobs.
-- Idempotent: skips if column already exists.

SET @dbname = DATABASE();
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'jobs' AND COLUMN_NAME = 'no_index'
  ) > 0,
  'SELECT 1',
  'ALTER TABLE `jobs` ADD COLUMN `no_index` BOOLEAN NOT NULL DEFAULT FALSE;'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;
