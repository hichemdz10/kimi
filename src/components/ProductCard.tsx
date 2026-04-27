import { useRef, useCallback } from 'react';
import { Plus } from 'lucide-react';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  index: number;
}

export default function ProductCard({ product, onAdd, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const xRel = Math.max(-1, Math.min(1, (x - centerX) / centerX));
    const yRel = Math.max(-1, Math.min(1, (y - centerY) / centerY));

    const rotateX = yRel * -12;
    const rotateY = xRel * 12;
    const translateZ = 40 + (1 - Math.abs(xRel) - Math.abs(yRel)) * 20;

    const shadowX = rotateY * -0.5;
    const shadowY = Math.abs(rotateX) * 0.8 + 15;
    const shadowBlur = 30 + translateZ * 0.5;

    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (!card) return;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
      card.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    cancelAnimationFrame(rafId.current);
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  }, []);

  const handleClick = useCallback(() => {
    const card = cardRef.current;
    if (!card) {
      onAdd(product);
      return;
    }

    // Press animation
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(-10px) scale(0.96)';
    card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';

    setTimeout(() => {
      if (card) {
        card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }
      onAdd(product);
    }, 150);
  }, [product, onAdd]);

  const getBadgeClass = () => {
    switch (product.badge) {
      case 'new':
        return 'badge-new';
      case 'bestseller':
        return 'badge-bestseller';
      case 'sale':
        return 'badge-sale';
      default:
        return '';
    }
  };

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}
    >
      <div
        ref={cardRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="card-3d bg-[#fdfbf7] rounded-2xl overflow-hidden cursor-pointer relative group select-none"
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease',
        }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-600 group-hover:scale-105"
            draggable={false}
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <div
              className="w-10 h-10 rounded-full bg-[#d4a574] flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-300"
              style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
            >
              <Plus size={20} />
            </div>
          </div>
          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl text-xs font-semibold ${getBadgeClass()} ${product.badge === 'bestseller' || product.badge === 'new' ? 'badge-pulse' : ''}`}>
              {product.badgeText}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 text-right">
          <span className="text-xs text-[#6b5b51] font-medium">{product.category}</span>
          <h3 className="text-sm font-bold text-[#2c2420] mt-1 leading-tight">{product.title}</h3>
          <p className="font-mono-receipt text-[#6b5b51] text-sm mt-2">{product.price.toFixed(2)} ر.س</p>
        </div>
      </div>
    </div>
  );
}
