-- Ajouter quelques produits par défaut
INSERT INTO public.products (title, description, price, format, pages, cover_style, is_active) VALUES
('Livre Ebook', 'Version numérique avec liens interactifs vers les médias', 15000, 'EBOOK', 100, 'modern', true),
('Livre Standard', 'Livre physique qualité professionnelle', 25000, 'STANDARD', 150, 'classic', true),
('Livre Premium', 'Livre de luxe avec couverture personnalisée', 35000, 'PREMIUM', 200, 'elegant', true);

-- Créer un utilisateur admin par défaut dans les profiles
-- D'abord, nous devons créer un profil admin (l'utilisateur doit déjà exister dans auth.users)
-- Nous allons mettre à jour le profil existant s'il existe, sinon le créer