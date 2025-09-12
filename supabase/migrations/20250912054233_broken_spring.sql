/*
  # Create users and premium plans tables

  1. New Tables
    - `user_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan_type` (text, 'free' or 'premium')
      - `background_removals_used` (integer, default 0)
      - `background_removals_limit` (integer, default 3)
      - `expiry_date` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `activation_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `is_used` (boolean, default false)
      - `used_by` (uuid, references auth.users, nullable)
      - `used_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for activation code usage
*/

-- Create user_plans table
CREATE TABLE IF NOT EXISTS user_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type text NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
  background_removals_used integer NOT NULL DEFAULT 0,
  background_removals_limit integer NOT NULL DEFAULT 3,
  expiry_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activation_codes table
CREATE TABLE IF NOT EXISTS activation_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  is_used boolean DEFAULT false,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;

-- Policies for user_plans
CREATE POLICY "Users can read own plan data"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plan data"
  ON user_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plan data"
  ON user_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for activation_codes
CREATE POLICY "Users can read unused activation codes"
  ON activation_codes
  FOR SELECT
  TO authenticated
  USING (NOT is_used);

CREATE POLICY "Users can update activation codes when using them"
  ON activation_codes
  FOR UPDATE
  TO authenticated
  USING (NOT is_used)
  WITH CHECK (auth.uid() = used_by AND is_used = true);

-- Insert activation codes
INSERT INTO activation_codes (code) VALUES
  ('PLM8Q2'),
  ('KJT3B9'),
  ('ZRX1M4'),
  ('QWF7N6'),
  ('HPL2V8'),
  ('BND5K1'),
  ('YTR9S3'),
  ('MNC4D7'),
  ('SLP6G0'),
  ('VBG2H5'),
  ('XQZ8L1'),
  ('RFT0P6'),
  ('GHY3T2'),
  ('LOP5Z9'),
  ('CZM7R4'),
  ('NBA1K8'),
  ('TUV6W3'),
  ('JKL9X0'),
  ('FGH2Y5'),
  ('QAZ4S7')
ON CONFLICT (code) DO NOTHING;

-- Create function to automatically create user plan on signup
CREATE OR REPLACE FUNCTION create_user_plan()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_plans (user_id, plan_type, background_removals_used, background_removals_limit)
  VALUES (NEW.id, 'free', 0, 3);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user plan
DROP TRIGGER IF EXISTS create_user_plan_trigger ON auth.users;
CREATE TRIGGER create_user_plan_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_plan();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_plans_updated_at ON user_plans;
CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON user_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();