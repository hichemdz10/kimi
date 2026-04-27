export interface Product {
  id: number;
  title: string;
  category: string;
  categorySlug: string;
  price: number;
  image: string;
  badge?: 'new' | 'bestseller' | 'sale';
  badgeText?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const categories = [
  { slug: 'all', label: 'الكل' },
  { slug: 'books', label: 'الكتب' },
  { slug: 'school', label: 'الأدوات المدرسية' },
  { slug: 'toys', label: 'ألعاب الأطفال' },
  { slug: 'stationery', label: 'القرطاسية' },
  { slug: 'art', label: 'الرسم والإبداع' },
];

export const products: Product[] = [
  {
    id: 1,
    title: 'مغامرات في عالم الأرقام',
    category: 'كتب أطفال',
    categorySlug: 'books',
    price: 45.00,
    image: '/products/book-1.jpg',
    badge: 'bestseller',
    badgeText: 'الأكثر مبيعاً',
  },
  {
    id: 2,
    title: 'حقيبة فضاء مدرسية',
    category: 'أدوات مدرسية',
    categorySlug: 'school',
    price: 120.00,
    image: '/products/backpack-1.jpg',
    badge: 'new',
    badgeText: 'جديد',
  },
  {
    id: 3,
    title: 'ألوان مائية ٢٤ لون',
    category: 'الرسم والإبداع',
    categorySlug: 'art',
    price: 35.00,
    image: '/products/watercolor-1.jpg',
    badge: 'bestseller',
    badgeText: 'الأكثر مبيعاً',
  },
  {
    id: 4,
    title: 'مكعبات خشبية ملونة',
    category: 'ألعاب الأطفال',
    categorySlug: 'toys',
    price: 85.00,
    image: '/products/blocks-1.jpg',
  },
  {
    id: 5,
    title: 'دفتر يوميات جلدي',
    category: 'القرطاسية',
    categorySlug: 'stationery',
    price: 55.00,
    image: '/products/notebook-1.jpg',
    badge: 'new',
    badgeText: 'جديد',
  },
  {
    id: 6,
    title: 'أقلام شمع ٤٨ لون',
    category: 'الرسم والإبداع',
    categorySlug: 'art',
    price: 28.00,
    image: '/products/crayons-1.jpg',
  },
  {
    id: 7,
    title: 'دبddy لطيف',
    category: 'ألعاب الأطفال',
    categorySlug: 'toys',
    price: 65.00,
    image: '/products/teddy-1.jpg',
    badge: 'new',
    badgeText: 'جديد',
  },
  {
    id: 8,
    title: 'قصص الأنبياء للأطفال',
    category: 'كتب أطفال',
    categorySlug: 'books',
    price: 38.00,
    image: '/products/book-1.jpg',
  },
  {
    id: 9,
    title: 'حقيبة أدوات هندسية',
    category: 'الأدوات المدرسية',
    categorySlug: 'school',
    price: 42.00,
    image: '/products/backpack-1.jpg',
  },
  {
    id: 10,
    title: 'ألوان خشبية ٣٦ لون',
    category: 'الرسم والإبداع',
    categorySlug: 'art',
    price: 48.00,
    image: '/products/watercolor-1.jpg',
    badge: 'sale',
    badgeText: 'تخفيض',
  },
  {
    id: 11,
    title: 'قطار خشبي تعليمي',
    category: 'ألعاب الأطفال',
    categorySlug: 'toys',
    price: 95.00,
    image: '/products/blocks-1.jpg',
    badge: 'bestseller',
    badgeText: 'الأكثر مبيعاً',
  },
  {
    id: 12,
    title: 'ممحاة فنية على شكل حيوانات',
    category: 'القرطاسية',
    categorySlug: 'stationery',
    price: 12.00,
    image: '/products/crayons-1.jpg',
  },
];
