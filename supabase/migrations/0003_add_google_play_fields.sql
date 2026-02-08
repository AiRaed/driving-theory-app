-- Add Google Play billing fields to payments table
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS google_order_id text,
  ADD COLUMN IF NOT EXISTS google_purchase_token text,
  ADD COLUMN IF NOT EXISTS google_product_id text;

-- Update provider check constraint to include 'google_play'
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_provider_check;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_provider_check
  CHECK (provider IN ('stripe', 'google_play'));

-- Add index for Google Play lookups
CREATE INDEX IF NOT EXISTS idx_payments_google_order_id ON public.payments(google_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_google_purchase_token ON public.payments(google_purchase_token);





