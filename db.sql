-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image_url text,
  additional_images text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  sizes text[] DEFAULT '{}',
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create store settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  free_shipping_enabled boolean DEFAULT true,
  free_shipping_threshold numeric DEFAULT 100.00,
  shipping_cost numeric DEFAULT 10.00,
  tax_rate numeric DEFAULT 8.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending',
  shipping_cost numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  delivery_address jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  size text,
  color text,
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for store_settings
CREATE OR REPLACE TRIGGER update_store_settings_updated_at
    BEFORE UPDATE ON store_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default store settings
INSERT INTO store_settings (
  free_shipping_enabled,
  free_shipping_threshold,
  shipping_cost,
  tax_rate
) 
SELECT true, 100.00, 10.00, 8.00
WHERE NOT EXISTS (SELECT 1 FROM store_settings);

-- Insert sample products
INSERT INTO "public"."products" (
    "id", 
    "name", 
    "description", 
    "price", 
    "category", 
    "image_url", 
    "additional_images", 
    "colors", 
    "sizes", 
    "in_stock", 
    "featured", 
    "created_at"
) 
VALUES 
    (
        '22559973-4399-417e-9d87-39f045cb523a', 
        'Rectangular Sunglasses', 
        'Narrow rectangular acetate frame sunglasses. Polarised lenses. Case included.', 
        '64.99', 
        'accessories', 
        'https://static.zara.net/assets/public/0f85/93fe/12fd4e129d65/b374395b0b33/02750405800-e1/02750405800-e1.jpg?ts=1732620082461&w=563', 
        '{"https://static.zara.net/assets/public/5ab1/2f21/a30e440f9889/9bcaa5cdffff/02750405800-e2/02750405800-e2.jpg?ts=1732620081879&w=563", "https://static.zara.net/assets/public/b2fa/e0da/9e7241efb612/6b9adc7dd3bd/02750405800-e3/02750405800-e3.jpg?ts=1732620082843&w=563", "https://static.zara.net/assets/public/ed6f/cd7b/bea04aab9684/bb53be2061ed/02750405800-e4/02750405800-e4.jpg?ts=1732620083711&w=563", "https://static.zara.net/assets/public/6933/e26c/1f904e9abade/146ae47282e0/02750405800-e5/02750405800-e5.jpg?ts=1732620082135&w=563", "https://static.zara.net/assets/public/ae7c/c161/925b4b4b9ded/b1fc3042f1d0/02750409800-a1/02750409800-a1.jpg?ts=1743767907202&w=563", "https://static.zara.net/assets/public/ae8f/18ad/9b4e46e39c4f/e9b8305df000/02750409800-a2/02750409800-a2.jpg?ts=1743767906825&w=563"}', 
        '{"Black"}', 
        '{"One Size"}', 
        'true', 
        'true', 
        '2025-05-04 14:08:46.003898+00'
    ), 
    (
        '3f389bea-7d24-4c17-b929-a52a2ee8c3ee', 
        'Baggy Fit Carpenter Jeans', 
        'Baggy fit carpenter jeans. Five pockets. Multi-function strap detail on the leg. Washed effect. Zip fly and button fastening.', 
        '49.99', 
        'bottoms', 
        'https://static.zara.net/assets/public/48aa/fe9b/7c804175995a/23be122ec898/01538478500-e1/01538478500-e1.jpg?ts=1743434233063&w=563', 
        '{"https://static.zara.net/assets/public/19b6/2063/cec1409ea148/8ec3bbb77495/01538478500-e2/01538478500-e2.jpg?ts=1743434232825&w=563", "https://static.zara.net/assets/public/19b6/2063/cec1409ea148/8ec3bbb77495/01538478500-e2/01538478500-e2.jpg?ts=1743434232825&w=563", "https://static.zara.net/assets/public/19b6/2063/cec1409ea148/8ec3bbb77495/01538478500-e2/01538478500-e2.jpg?ts=1743434232825&w=563", "https://static.zara.net/assets/public/19b6/2063/cec1409ea148/8ec3bbb77495/01538478500-e2/01538478500-e2.jpg?ts=1743434232825&w=563"}', 
        '{"Green"}', 
        '{"36","38","40","42","44"}', 
        'true', 
        'true', 
        '2025-05-04 14:08:46.003898+00'
    ), 
    (
        '488000c5-690f-4e20-a9d0-cc2e3cea4659', 
        'Textured T-Shirt', 
        'Relaxed fit T-Shirt made from stretchy cotton fabric. Round neck and short sleeve. Ribbed hem.', 
        '34.99', 
        'tshirts', 
        'https://static.zara.net/assets/public/edb6/a011/75ba49e29703/7ce668d5d7fa/00761450800-e1/00761450800-e1.jpg?ts=1735549645184&w=750', 
        '{"https://static.zara.net/assets/public/b9ee/d71e/3b3c45e8aa0a/5cb841d7a6b5/00761450800-e2/00761450800-e2.jpg?ts=1735549646658&w=750", "https://static.zara.net/assets/public/c86c/9203/13cc46eebb30/7484c3cd4dfb/00761450800-a1/00761450800-a1.jpg?ts=1735554270964&w=1126", "https://static.zara.net/assets/public/75d5/0989/5beb4c379835/3868130a7f15/00761450800-a2/00761450800-a2.jpg?ts=1735554269891&w=750", "https://static.zara.net/assets/public/6c49/8146/9f224153849b/b334d4a346a2/00761450800-a3/00761450800-a3.jpg?ts=1735554269495&w=750"}', 
        '{"White","Black","Gray"}', 
        '{"S","M","L","XL"}', 
        'true', 
        'true', 
        '2025-05-04 14:08:46.003898+00'
    ), 
    (
        '9f2743c7-f8bb-4945-a14a-e574894b5580', 
        'Washed Zip-Up Hoodie', 
        'Relaxed fit hoodie. Hood and long sleeves. Front pouch pockets. Elasticated trims. Zip fastening on the front. Washed effect.', 
        '49.99', 
        'hoodies', 
        'https://static.zara.net/assets/public/7b71/b89a/1dbb43cc8ba8/ae68c70f4852/04729402898-e1/04729402898-e1.jpg?ts=1742224740470&w=563', 
        '{"https://static.zara.net/assets/public/83b4/cd5f/fb11483a8217/822bd751edd7/04729402898-e2/04729402898-e2.jpg?ts=1742224738421&w=563", "https://static.zara.net/assets/public/2ccd/52e3/72124779bd43/0602ddbcb4d5/04729402898-a5/04729402898-a5.jpg?ts=1742372859280&w=563", "https://static.zara.net/assets/public/c862/375f/2e304bcca7e9/fd64dd089342/04729402898-a3/04729402898-a3.jpg?ts=1742372857029&w=563", "https://static.zara.net/assets/public/0a72/231d/5394421bbb9b/d1004d33b9cc/04729402898-a2/04729402898-a2.jpg?ts=1742372855653&w=563", "https://static.zara.net/assets/public/8c75/211c/765e45e8b923/699bef4ebdf7/04729402898-a4/04729402898-a4.jpg?ts=1742372859315&w=563"}', 
        '{"Gray"}', 
        '{"S","M","L","XL"}', 
        'true', 
        'true', 
        '2025-05-04 14:08:46.003898+00'
    );
