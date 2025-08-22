-- Créer toutes les tables nécessaires pour le système complet

-- Table des produits/livres
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- en centimes XOF
  format TEXT NOT NULL CHECK (format IN ('A4', 'A5', 'Square')),
  pages INTEGER DEFAULT 20,
  cover_style TEXT DEFAULT 'modern',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des commandes
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED')),
  book_format TEXT NOT NULL,
  book_title TEXT,
  total_amount INTEGER NOT NULL, -- en centimes XOF
  payment_method TEXT CHECK (payment_method IN ('orange_money', 'wave', 'credit_card', 'bank_transfer')),
  payment_provider TEXT,
  transaction_id TEXT,
  shipping_address JSONB NOT NULL,
  book_data JSONB, -- données du livre (messages, style, etc.)
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des éléments de commande
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- en centimes XOF
  total_price INTEGER NOT NULL, -- en centimes XOF
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des paiements
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('orange_money', 'wave', 'credit_card', 'bank_transfer')),
  provider_transaction_id TEXT,
  amount INTEGER NOT NULL, -- en centimes XOF
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED')),
  provider_response JSONB,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order_created', 'payment_success', 'order_shipped', 'order_delivered')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour products (lecture publique)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Politiques RLS pour orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Politiques RLS pour order_items
CREATE POLICY "Users can view their own order items" 
ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);

CREATE POLICY "Users can manage their own order items" 
ON public.order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);

-- Politiques RLS pour payments
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);

CREATE POLICY "Edge functions can manage payments" 
ON public.payments FOR ALL USING (true);

-- Politiques RLS pour notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications FOR INSERT WITH CHECK (true);

-- Triggers pour updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour générer les références de commande
CREATE OR REPLACE FUNCTION generate_order_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CMD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger pour générer automatiquement la référence de commande
CREATE OR REPLACE FUNCTION set_order_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_reference IS NULL THEN
    NEW.order_reference = generate_order_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_order_reference_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION set_order_reference();

-- Insérer des produits de base
INSERT INTO public.products (title, description, price, format, pages) VALUES
('Livre Conversation A4', 'Livre de conversations au format A4, parfait pour conserver vos plus beaux échanges', 2500000, 'A4', 24),
('Livre Conversation A5', 'Livre de conversations au format A5, compact et pratique', 2000000, 'A5', 20),
('Livre Conversation Carré', 'Livre de conversations au format carré, design moderne', 2200000, 'Square', 22);