-- Add no_index column to jobs table (SEO: per-job noindex control)
-- Added to schema but migration was missed in earlier commits.
-- Used by: jobs/[...slug]/page.jsx generateMetadata() to honor individual noIndex flags.

ALTER TABLE `jobs`
  ADD COLUMN `no_index` BOOLEAN NOT NULL DEFAULT FALSE;
