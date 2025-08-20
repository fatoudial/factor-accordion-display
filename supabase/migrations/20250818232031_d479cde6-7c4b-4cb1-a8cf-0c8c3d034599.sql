-- Create books table
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  cover_url TEXT,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PROCESSING', 'COMPLETED', 'ERROR')),
  file_path TEXT,
  original_zip_url TEXT,
  total_pages INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  processing_progress INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
  payment_method TEXT CHECK (payment_method IN ('ORANGE_MONEY', 'WAVE', 'CREDIT_CARD')),
  payment_reference TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  external_transaction_id TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create book_media table for storing extracted media
CREATE TABLE public.book_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  media_type TEXT CHECK (media_type IN ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT')),
  original_name TEXT,
  file_url TEXT,
  qr_code_url TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for books
CREATE POLICY "Users can view own books" ON public.books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own books" ON public.books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books" ON public.books
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for orders  
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for book_media
CREATE POLICY "Users can view media of own books" ON public.book_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.books 
      WHERE id = book_media.book_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create media for own books" ON public.book_media
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.books 
      WHERE id = book_media.book_id AND user_id = auth.uid()
    )
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('book-files', 'book-files', true),
  ('book-media', 'book-media', true),
  ('user-uploads', 'user-uploads', false);

-- Create storage policies
CREATE POLICY "Users can upload their files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public access to book files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('book-files', 'book-media'));

CREATE POLICY "Authenticated users can upload book media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('book-files', 'book-media') AND 
    auth.role() = 'authenticated'
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();