import { useState, useCallback, useMemo } from 'react';
import { Search, Barcode, LayoutGrid, List, ShoppingCart } from 'lucide-react';
import { products } from '@/data/products';
import type { Product, CartItem } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ReceiptSidebar from '@/components/ReceiptSidebar';
import CategoryNav from '@/components/CategoryNav';
import PaymentModal from '@/components/PaymentModal';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.categorySlug === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  // Cart calculations
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  // Add to cart
  const handleAddToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  // Remove from cart
  const handleRemoveFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Update quantity
  const handleUpdateQuantity = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // Checkout
  const handleCheckout = useCallback(() => {
    setIsPaymentOpen(true);
  }, []);

  // Confirm payment
  const handleConfirmPayment = useCallback(() => {
    setCart([]);
    setIsPaymentOpen(false);
    setIsMobileCartOpen(false);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#3a2e2a]" dir="rtl">
      {/* Main Product Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search & Actions Bar */}
        <div className="bg-[#3a2e2a] border-b border-[#4a3b34] px-4 py-3 flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89a8e] pointer-events-none"
            />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pr-10 pl-4 rounded-xl text-sm text-[#2c2420] placeholder-[#a89a8e] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a574]/30"
              style={{
                backgroundColor: 'rgba(253, 251, 247, 0.9)',
                border: '1px solid #c3bcb2',
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#fdfbf7';
                e.currentTarget.style.border = '2px solid #d4a574';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(253, 251, 247, 0.9)';
                e.currentTarget.style.border = '1px solid #c3bcb2';
              }}
            />
          </div>

          {/* Barcode Button */}
          <button className="w-10 h-10 rounded-xl bg-[rgba(253,251,247,0.9)] flex items-center justify-center text-[#2c2420] hover:bg-[#fdfbf7] hover:scale-110 active:scale-95 transition-all">
            <Barcode size={20} />
          </button>

          {/* Layout Toggle */}
          <div className="hidden sm:flex bg-[rgba(253,251,247,0.9)] rounded-xl p-1 gap-1">
            <button
              onClick={() => setLayout('grid')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                layout === 'grid'
                  ? 'bg-[#d4a574] text-white'
                  : 'text-[#6b5b51] hover:text-[#2c2420]'
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                layout === 'list'
                  ? 'bg-[#d4a574] text-white'
                  : 'text-[#6b5b51] hover:text-[#2c2420]'
              }`}
            >
              <List size={16} />
            </button>
          </div>

          {/* Mobile Cart Button */}
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="lg:hidden relative w-10 h-10 rounded-xl bg-[rgba(253,251,247,0.9)] flex items-center justify-center text-[#2c2420] hover:bg-[#fdfbf7] transition-all"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#d4a574] text-white text-xs font-bold flex items-center justify-center animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Category Navigation */}
        <CategoryNav active={activeCategory} onSelect={setActiveCategory} />

        {/* Product Grid */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          style={{ perspective: '1500px' }}
        >
          {filteredProducts.length === 0 ? (
            <div className="text-center text-[#a89a8e] py-20">
              <p className="text-lg">لا توجد منتجات</p>
              <p className="text-sm mt-2">جرب البحث بكلمات مختلفة</p>
            </div>
          ) : (
            <div
              className={
                layout === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'
                  : 'flex flex-col gap-3 max-w-2xl'
              }
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleAddToCart}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Receipt Sidebar */}
      <div className="hidden lg:block">
        <ReceiptSidebar
          items={cart}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
        />
      </div>

      {/* Mobile Cart Bottom Sheet */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileCartOpen(false)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#fdfbf7] rounded-t-3xl max-h-[80vh] flex flex-col animate-slide-up"
            style={{ animationDuration: '0.3s' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#c3bcb2]" />
            </div>
            <div className="flex-1 overflow-hidden">
              <ReceiptSidebar
                items={cart}
                onRemove={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        total={cartTotals.total}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}
