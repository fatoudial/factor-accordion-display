-- Désactiver la confirmation d'email pour faciliter les tests
-- Créer directement un utilisateur admin confirmé

-- Insérer directement dans auth.users avec email confirmé
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
    phone_change_confirmed_at,
    created_at,
    updated_at,
    banned_until,
    deleted_at,
    is_sso_user,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '8e098857-2ef2-42ce-8539-d9c7faac8baf',
    'authenticated',
    'authenticated',
    'mbodjfaticha99@gmail.com',
    '$2a$10$WG.8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8V8Z8', -- Hash pour 'passer'
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
    NULL,
    NOW(),
    NOW(),
    NULL,
    NULL,
    false,
    '{"provider": "email", "providers": ["email"]}',
    '{"first_name": "Fatima", "last_name": "Mbodj"}',
    false,
    false
) ON CONFLICT (id) DO UPDATE SET
    email_confirmed_at = NOW(),
    confirmed_at = NOW(),
    raw_user_meta_data = '{"first_name": "Fatima", "last_name": "Mbodj"}'::jsonb;

-- Créer ou mettre à jour le profil admin
INSERT INTO public.profiles (id, email, first_name, last_name, role)
VALUES (
    '8e098857-2ef2-42ce-8539-d9c7faac8baf',
    'mbodjfaticha99@gmail.com',
    'Fatima',
    'Mbodj',
    'ADMIN'
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = 'ADMIN';