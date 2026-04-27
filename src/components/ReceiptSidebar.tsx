import { useRef, useEffect } from 'react';
import { Lock, Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem } from '@/data/products';

interface ReceiptSidebarProps {
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onCheckout: () => void;
}

export default function ReceiptSidebar({ items, onRemove, onUpdateQuantity, onCheckout }: ReceiptSidebarProps) {
  const receiptListRef = useRef<HTMLDivElement>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  // Auto-scroll to bottom when items change
  useEffect(() => {
    if (receiptListRef.current) {
      receiptListRef.current.scrollTop = receiptListRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <div className="w-[380px] min-w-[380px] bg-[#fdfbf7] h-screen flex flex-col shadow-[-2px_0_20px_rgba(0,0,0,0.5)] z-10" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-[#fdfbf7] border-b-2 border-dashed border-[#c3bcb2] text-center">
        <div
          className="inline-block px-6 py-2.5 rounded-md text-lg font-bold tracking-wide animate-slide-up"
          style={{
            backgroundColor: '#2c2420',
            color: '#fdfbf7',
            fontFamily: "'Noto Sans Arabic', sans-serif",
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          }}
        >
          مكتبة العبقري
        </div>
        <p className="text-xs text-[#6b5b51] mt-2 font-mono-receipt animate-fade-in">
          أدوات مدرسية · ألعاب تعليمية
        </p>
        <div className="flex justify-between mt-3 text-xs text-[#6b5b51] font-mono-receipt px-2">
          <span>فاتورة رقم: ١٤٢٧</span>
          <span>٢٧ أبريل ٢٠٢٦</span>
        </div>
      </div>

      {/* Receipt Items */}
      <div
        ref={receiptListRef}
        className="flex-1 overflow-y-auto px-6 py-4 receipt-scroll"
        style={{ backgroundColor: '#fdfbf7' }}
      >
        {items.length === 0 ? (
          <div className="text-center text-[#a89a8e] py-12 italic text-sm">
            السلة فارغة
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="receipt-item py-3 flex flex-col gap-1 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm text-[#2c2420] flex-1 text-right">{item.title}</span>
                  <span className="font-mono-receipt text-sm text-[#2c2420] mr-2">{(item.price * item.quantity).toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="w-6 h-6 rounded flex items-center justify-center text-[#8b4444] hover:bg-[#8b4444]/10 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div className="flex items-center gap-1 mx-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-5 h-5 rounded bg-[#f4f1ea] flex items-center justify-center text-[#6b5b51] hover:bg-[#e8e4db] transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="font-mono-receipt text-xs w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-5 h-5 rounded bg-[#f4f1ea] flex items-center justify-center text-[#6b5b51] hover:bg-[#e8e4db] transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <span className="font-mono-receipt text-xs text-[#a89a8e]">× {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total Section */}
      <div
        className="px-6 py-5 border-t-2 border-[#2c2420] receipt-curl"
        style={{ backgroundColor: '#f4f1ea' }}
      >
        <div className="space-y-2 font-mono-receipt text-sm">
          <div className="flex justify-between text-[#6b5b51]">
            <span>الإجمالي الفرعي</span>
            <span>{subtotal.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between text-[#6b5b51]">
            <span>ضريبة القيمة المضافة (١٥٪)</span>
            <span>{tax.toFixed(2)} ر.س</span>
          </div>
          <div className="border-t border-dashed border-[#c3bcb2] pt-2 mt-2">
            <div className="flex justify-between font-bold text-base text-[#2c2420]">
              <span>الإجمالي الكلي</span>
              <span>{total.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full mt-4 py-3.5 rounded-lg font-mono-receipt text-base font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: items.length === 0 ? '#c3bcb2' : '#2c2420',
            color: '#fdfbf7',
            boxShadow: items.length > 0 ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (items.length > 0) {
              e.currentTarget.style.backgroundColor = '#3d312c';
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = items.length === 0 ? '#c3bcb2' : '#2c2420';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseDown={(e) => {
            if (items.length > 0) {
              e.currentTarget.style.transform = 'scale(0.98)';
              e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3)';
            }
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
        >
          <Lock size={18} />
          إتمام الدفع
        </button>
      </div>
    </div>
  );
}
