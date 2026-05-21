-- Seed high-end phones from Apple, Samsung, Google, Huawei, Xiaomi (2025-2026)

-- 1. Insert Products
INSERT INTO products (slug, name, badge, brand, category, price, tagline, description, is_active, is_featured, created_at, colors, storage_options, features, specs)
VALUES
-- Apple
('iphone-17-pro-max', 'iPhone 17 Pro Max', 'NEW', 'Apple', 'Smartphones', 1850000, 'Titanium. Maximum impact.', 'The ultimate iPhone experience with a massive 6.9-inch display, A19 Pro chip, and unprecedented battery life.', true, true, now(), '["Natural Titanium", "Black Titanium", "Desert Titanium"]', '["256GB", "512GB", "1TB"]', '["A19 Pro Chip", "48MP Main Camera", "Always-On Display"]', '[{"key":"Display","value":"6.9-inch Super Retina XDR"},{"key":"Processor","value":"A19 Pro"}]'),
('iphone-16-pro-max', 'iPhone 16 Pro Max', null, 'Apple', 'Smartphones', 1450000, 'Titanium. Pro performance.', 'A stunning leap forward with the A18 Pro chip, 5x Telephoto camera, and Aerospace-grade titanium.', true, false, now() - interval '1 year', '["Natural Titanium", "White Titanium", "Blue Titanium"]', '["256GB", "512GB", "1TB"]', '["A18 Pro Chip", "5x Optical Zoom", "Action Button"]', '[{"key":"Display","value":"6.7-inch Super Retina XDR"},{"key":"Processor","value":"A18 Pro"}]'),
('iphone-16-pro', 'iPhone 16 Pro', null, 'Apple', 'Smartphones', 1250000, 'Titanium. Compact power.', 'Pro-level photography and performance in a compact form factor.', true, false, now() - interval '1 year', '["Natural Titanium", "White Titanium", "Blue Titanium"]', '["128GB", "256GB", "512GB", "1TB"]', '["A18 Pro Chip", "3x Optical Zoom", "Action Button"]', '[{"key":"Display","value":"6.1-inch Super Retina XDR"},{"key":"Processor","value":"A18 Pro"}]'),

-- Samsung
('galaxy-z-fold-7', 'Galaxy Z Fold 7', 'NEW', 'Samsung', 'Smartphones', 2200000, 'Unfold endless possibilities.', 'The most advanced foldable experience. Thinner, lighter, and powered by the latest Galaxy AI.', true, true, now(), '["Phantom Black", "Titanium Gray"]', '["512GB", "1TB"]', '["Galaxy AI", "S Pen Support", "Under Display Camera"]', '[{"key":"Display","value":"7.6-inch AMOLED 2X"},{"key":"Processor","value":"Snapdragon 8 Gen 4"}]'),
('galaxy-s25-ultra', 'Galaxy S25 Ultra', null, 'Samsung', 'Smartphones', 1150000, 'Epic, just like that.', 'Unleash your creativity with the S25 Ultra featuring an integrated S Pen and a 200MP camera.', true, false, now() - interval '1 year', '["Titanium Black", "Titanium Violet"]', '["256GB", "512GB", "1TB"]', '["200MP Camera", "S Pen Included", "Dynamic AMOLED"]', '[{"key":"Display","value":"6.8-inch QHD+"},{"key":"Processor","value":"Snapdragon 8 Gen 3"}]'),
('galaxy-z-fold-6', 'Galaxy Z Fold 6', null, 'Samsung', 'Smartphones', 1800000, 'PC-like power in your pocket.', 'Unfold a massive screen and master multitasking like never before.', true, false, now() - interval '1 year', '["Navy", "Silver Shadow"]', '["256GB", "512GB"]', '["Flex Mode", "Armor Aluminum", "Taskbar"]', '[{"key":"Display","value":"7.6-inch AMOLED 2X"},{"key":"Processor","value":"Snapdragon 8 Gen 3"}]'),

-- Google
('pixel-10-pro-xl', 'Pixel 10 Pro XL', 'NEW', 'Google', 'Smartphones', 1250000, 'Google AI. Supersized.', 'The biggest screen and the biggest battery, fueled by the revolutionary Tensor G5 chip.', true, true, now(), '["Obsidian", "Porcelain", "Hazel"]', '["256GB", "512GB", "1TB"]', '["Tensor G5", "Gemini Advanced", "Super Res Zoom"]', '[{"key":"Display","value":"6.8-inch Super Actua"},{"key":"Processor","value":"Google Tensor G5"}]'),
('pixel-9-pro-fold', 'Pixel 9 Pro Fold', null, 'Google', 'Smartphones', 1750000, 'The magic of Pixel, folded.', 'A sleek foldable with the best of Google AI and an incredibly thin design.', true, false, now() - interval '1 year', '["Obsidian", "Porcelain"]', '["256GB", "512GB"]', '["Tensor G4", "Split Screen", "Magic Editor"]', '[{"key":"Display","value":"8-inch Super Actua Flex"},{"key":"Processor","value":"Google Tensor G4"}]'),
('pixel-9-pro', 'Pixel 9 Pro', null, 'Google', 'Smartphones', 950000, 'Pro performance. Pixel magic.', 'Experience the first Pixel to feature the Tensor G4 chip and next-gen computational photography.', true, false, now() - interval '1 year', '["Obsidian", "Porcelain", "Rose Quartz"]', '["128GB", "256GB", "512GB"]', '["Tensor G4", "Pro Controls", "Video Boost"]', '[{"key":"Display","value":"6.3-inch Super Actua"},{"key":"Processor","value":"Google Tensor G4"}]'),

-- Huawei
('mate-80-pro', 'Huawei Mate 80 Pro', 'NEW', 'Huawei', 'Smartphones', 1350000, 'Innovation beyond boundaries.', 'A leap in smartphone photography with the new XMAGE system and satellite connectivity.', true, true, now(), '["Emerald Green", "Black", "White"]', '["256GB", "512GB", "1TB"]', '["XMAGE Camera", "Satellite Calling", "Kunlun Glass"]', '[{"key":"Display","value":"6.82-inch LTPO OLED"},{"key":"Processor","value":"Kirin 9100"}]'),
('pura-80-ultra', 'Huawei Pura 80 Ultra', 'NEW', 'Huawei', 'Smartphones', 1450000, 'Art and technology combined.', 'The peak of aesthetic design meeting groundbreaking retractable camera tech.', true, false, now(), '["Chanson Green", "Mocha Brown"]', '["512GB", "1TB"]', '["Retractable Camera", "Macro Telephoto", "Premium Leather"]', '[{"key":"Display","value":"6.8-inch LTPO OLED"},{"key":"Processor","value":"Kirin 9100"}]'),
('mate-70-pro', 'Huawei Mate 70 Pro', null, 'Huawei', 'Smartphones', 1050000, 'Symmetry. Beauty. Power.', 'The classic Mate series returns with an iconic Space Ring design and incredible performance.', true, false, now() - interval '1 year', '["Green", "Black", "Silver"]', '["256GB", "512GB"]', '["XMAGE Camera", "AI Features", "Fast Charging"]', '[{"key":"Display","value":"6.82-inch OLED"},{"key":"Processor","value":"Kirin 9000S"}]'),

-- Xiaomi
('xiaomi-16-ultra', 'Xiaomi 16 Ultra', 'NEW', 'Xiaomi', 'Smartphones', 1400000, 'Leica optics. Ultimate vision.', 'Co-engineered with Leica to provide a professional photography experience in a smartphone.', true, true, now(), '["Black", "White", "Olive Green"]', '["512GB", "1TB"]', '["Leica Quad Camera", "1-inch Sensor", "Snapdragon 8 Gen 4"]', '[{"key":"Display","value":"6.73-inch AMOLED"},{"key":"Processor","value":"Snapdragon 8 Gen 4"}]'),
('xiaomi-15-ultra', 'Xiaomi 15 Ultra', null, 'Xiaomi', 'Smartphones', 1100000, 'Photography redefined.', 'Incredible Leica cameras meet the blazing speed of the Snapdragon 8 Gen 3.', true, false, now() - interval '1 year', '["Black", "White"]', '["256GB", "512GB"]', '["Leica Optics", "120W Fast Charging", "Snapdragon 8 Gen 3"]', '[{"key":"Display","value":"6.73-inch AMOLED"},{"key":"Processor","value":"Snapdragon 8 Gen 3"}]')

ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Images
-- Need to get the product IDs first.
DO $$
DECLARE
  iphone_17_pro_max_id uuid;
  iphone_16_pro_max_id uuid;
  iphone_16_pro_id uuid;
  galaxy_z_fold_7_id uuid;
  galaxy_s25_ultra_id uuid;
  galaxy_z_fold_6_id uuid;
  pixel_10_pro_xl_id uuid;
  pixel_9_pro_fold_id uuid;
  pixel_9_pro_id uuid;
  mate_80_pro_id uuid;
  pura_80_ultra_id uuid;
  mate_70_pro_id uuid;
  xiaomi_16_ultra_id uuid;
  xiaomi_15_ultra_id uuid;
BEGIN
  SELECT id INTO iphone_17_pro_max_id FROM products WHERE slug = 'iphone-17-pro-max';
  SELECT id INTO iphone_16_pro_max_id FROM products WHERE slug = 'iphone-16-pro-max';
  SELECT id INTO iphone_16_pro_id FROM products WHERE slug = 'iphone-16-pro';
  SELECT id INTO galaxy_z_fold_7_id FROM products WHERE slug = 'galaxy-z-fold-7';
  SELECT id INTO galaxy_s25_ultra_id FROM products WHERE slug = 'galaxy-s25-ultra';
  SELECT id INTO galaxy_z_fold_6_id FROM products WHERE slug = 'galaxy-z-fold-6';
  SELECT id INTO pixel_10_pro_xl_id FROM products WHERE slug = 'pixel-10-pro-xl';
  SELECT id INTO pixel_9_pro_fold_id FROM products WHERE slug = 'pixel-9-pro-fold';
  SELECT id INTO pixel_9_pro_id FROM products WHERE slug = 'pixel-9-pro';
  SELECT id INTO mate_80_pro_id FROM products WHERE slug = 'mate-80-pro';
  SELECT id INTO pura_80_ultra_id FROM products WHERE slug = 'pura-80-ultra';
  SELECT id INTO mate_70_pro_id FROM products WHERE slug = 'mate-70-pro';
  SELECT id INTO xiaomi_16_ultra_id FROM products WHERE slug = 'xiaomi-16-ultra';
  SELECT id INTO xiaomi_15_ultra_id FROM products WHERE slug = 'xiaomi-15-ultra';

  -- Apple Images
  IF iphone_17_pro_max_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (iphone_17_pro_max_id, '/iphone_17_pro_max.png', true, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF iphone_16_pro_max_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (iphone_16_pro_max_id, '/iphone_16_pro_max.png', true, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF iphone_16_pro_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (iphone_16_pro_id, 'https://images.unsplash.com/photo-1707227155609-843da52ba6ba?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;

  -- Samsung Images
  IF galaxy_z_fold_7_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (galaxy_z_fold_7_id, '/galaxy_z_fold_7.png', true, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF galaxy_s25_ultra_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (galaxy_s25_ultra_id, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF galaxy_z_fold_6_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (galaxy_z_fold_6_id, 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;

  -- Google Images
  IF pixel_10_pro_xl_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (pixel_10_pro_xl_id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cd893?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF pixel_9_pro_fold_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (pixel_9_pro_fold_id, 'https://images.unsplash.com/photo-1694086602482-df720eb180dc?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF pixel_9_pro_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (pixel_9_pro_id, 'https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;

  -- Huawei Images
  IF mate_80_pro_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (mate_80_pro_id, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF pura_80_ultra_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (pura_80_ultra_id, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF mate_70_pro_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (mate_70_pro_id, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;

  -- Xiaomi Images
  IF xiaomi_16_ultra_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (xiaomi_16_ultra_id, 'https://images.unsplash.com/photo-1592899677974-c48ebf8ee204?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF xiaomi_15_ultra_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, url, is_primary, sort_order) VALUES (xiaomi_15_ultra_id, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format', true, 1) ON CONFLICT DO NOTHING;
  END IF;

END $$;
