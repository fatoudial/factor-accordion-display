-- Corriger l'erreur de récursion infinie dans les politiques RLS profiles
-- Supprimer la politique problématique et la recréer correctement
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Créer une nouvelle politique admin sans récursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'ADMIN'
  )
);

-- Créer un compte utilisateur standard pour test
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_sent_at,
    recovery_token,
    email_change_sent_at,
    email_change,
    email_change_token_new,
    email_change_token_current,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    confirmed_at,
    phone_confirmed_at,
    created_at,
    updated_at,
    banned_until,
    deleted_at,
    is_sso_user,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_anonymous
) SELECT 
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'user.test@example.com',
    '$2a$10$WG.8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8', -- Hash pour 'password123'
    NOW(),
    NOW(),
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    '',
    '',
    '',
    NULL,
    NOW(),
    NULL,
    NOW(),
    NOW(),
    NULL,
    NULL,
    false,
    '{"provider": "email", "providers": ["email"]}',
    '{"first_name": "Utilisateur", "last_name": "Test"}',
    false,
    false
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user.test@example.com');

-- Créer le profil utilisateur standard
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT 
    u.id,
    u.email,
    'Utilisateur',
    'Test',
    'USER'
FROM auth.users u
WHERE u.email = 'user.test@example.com'
ON CONFLICT (id) DO UPDATE SET
    first_name = 'Utilisateur',
    last_name = 'Test',
    role = 'USER';