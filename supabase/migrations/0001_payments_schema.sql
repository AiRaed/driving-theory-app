-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  stripe_customer_id text UNIQUE,
  access_level text NOT NULL DEFAULT 'free' CHECK (access_level IN ('free', 'paid')),
  paid_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'stripe',
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text UNIQUE,
  amount int NOT NULL,
  currency text NOT NULL DEFAULT 'gbp',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on profiles update
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile after user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- SELECT: users can read ONLY their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (id = auth.uid());

-- INSERT: users can insert ONLY their own profile row
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());

-- UPDATE: users can update ONLY safe fields (email, updated_at) on their own row
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

-- Payments RLS Policies
-- SELECT: users can read ONLY their own payments
CREATE POLICY "Users can read own payments"
  ON public.payments
  FOR SELECT
  USING (user_id = auth.uid());

-- INSERT: DISALLOW for normal users (only server/service role)
CREATE POLICY "No user insert on payments"
  ON public.payments
  FOR INSERT
  WITH CHECK (false);

-- UPDATE: DISALLOW for normal users (only server/service role)
CREATE POLICY "No user update on payments"
  ON public.payments
  FOR UPDATE
  USING (false);

-- DELETE: DISALLOW for normal users (only server/service role)
CREATE POLICY "No user delete on payments"
  ON public.payments
  FOR DELETE
  USING (false);

