import { categories } from '@/data/products';

interface CategoryNavProps {
  active: string;
  onSelect: (slug: string) => void;
}

export default function CategoryNav({ active, onSelect }: CategoryNavProps) {
  return (
    <div className="sticky top-0 z-30 bg-[#3a2e2a]/95 backdrop-blur-md py-3 px-4 border-b border-[#4a3b34]">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" dir="rtl">
        {categories.map((cat, index) => (
          <button
            key={cat.slug}
            onClick={() => onSelect(cat.slug)}
            className={`category-btn whitespace-nowrap animate-slide-up ${active === cat.slug ? 'active' : ''}`}
            style={{ animationDelay: `${index * 40}ms`, opacity: 0 }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
