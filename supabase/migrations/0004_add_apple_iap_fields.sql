-- Add Apple In-App Purchase fields to payments table
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS apple_transaction_id text,
  ADD COLUMN IF NOT EXISTS apple_original_transaction_id text,
  ADD COLUMN IF NOT EXISTS apple_product_id text;

-- Update provider check constraint to include 'apple'
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_provider_check;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_provider_check
  CHECK (provider IN ('stripe', 'google_play', 'apple'));

-- Indexes for Apple lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_apple_transaction_id
  ON public.payments(apple_transaction_id)
  WHERE apple_transaction_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payments_apple_original_transaction_id
  ON public.payments(apple_original_transaction_id);
