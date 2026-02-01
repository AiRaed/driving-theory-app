-- Add free_questions_used column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS free_questions_used integer NOT NULL DEFAULT 0;

-- Update RLS policy to allow users to update free_questions_used
-- But still prevent them from updating access_level, paid_at, stripe_customer_id
DROP POLICY IF EXISTS "Users can update own profile safe fields" ON public.profiles;

CREATE POLICY "Users can update own profile safe fields"
  ON public.profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    OLD.access_level = NEW.access_level AND
    OLD.stripe_customer_id IS NOT DISTINCT FROM NEW.stripe_customer_id AND
    OLD.paid_at IS NOT DISTINCT FROM NEW.paid_at
  );

