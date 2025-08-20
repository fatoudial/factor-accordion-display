-- Confirmer l'email de l'utilisateur existant
UPDATE auth.users 
SET 
    email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'mbodjfaticha99@gmail.com';

-- Créer ou mettre à jour le profil admin
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT 
    id,
    email,
    'Fatima',
    'Mbodj',
    'ADMIN'
FROM auth.users 
WHERE email = 'mbodjfaticha99@gmail.com'
ON CONFLICT (id) DO UPDATE SET
    first_name = 'Fatima',
    last_name = 'Mbodj',
    role = 'ADMIN';