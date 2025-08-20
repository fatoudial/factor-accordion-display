-- Corriger l'erreur de récursion infinie dans les politiques RLS
-- Supprimer les politiques problématiques
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Créer une fonction sécurisée pour éviter la récursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recréer les politiques sans récursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR ALL
USING (public.get_current_user_role() = 'ADMIN');

-- Confirmer le compte user existant dans Supabase
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'user.test@example.com' AND email_confirmed_at IS NULL;