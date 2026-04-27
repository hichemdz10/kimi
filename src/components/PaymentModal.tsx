import { useState, useEffect, useRef } from 'react';
import { X, Check, Banknote, CreditCard } from 'lucide-react';
import gsap from 'gsap';

interface PaymentModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onConfirm: () => void;
}

const paymentMethods = [
  { id: 'cash', label: 'نقدي', icon: Banknote },
  { id: 'card', label: 'بطاقة', icon: CreditCard },
  { id: 'mada', label: 'مدى', icon: CreditCard },
];

export default function PaymentModal({ isOpen, total, onClose, onConfirm }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('cash');
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsProcessing(false);
      setPaidAmount('');
      setSelectedMethod('cash');

      const tl = gsap.timeline();
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      tl.fromTo(
        modalRef.current,
        { rotateX: -15, y: 30, scale: 0.9, opacity: 0 },
        { rotateX: 0, y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.1'
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });
    tl.to(modalRef.current, {
      rotateX: 10,
      y: 30,
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
    tl.to(
      backdropRef.current,
      { opacity: 0, duration: 0.2 },
      '-=0.1'
    );
  };

  const handleConfirm = () => {
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Animate to receipt
      gsap.to(modalRef.current, {
        width: 380,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Auto close after success
      setTimeout(() => {
        onConfirm();
        handleClose();
      }, 2000);
    }, 1500);
  };

  const handleNumpadPress = (key: string) => {
    if (key === 'clear') {
      setPaidAmount('');
    } else if (key === 'backspace') {
      setPaidAmount((prev) => prev.slice(0, -1));
    } else if (key === '.') {
      if (!paidAmount.includes('.')) {
        setPaidAmount((prev) => prev + '.');
      }
    } else {
      setPaidAmount((prev) => prev + key);
    }
  };

  const paid = parseFloat(paidAmount) || 0;
  const change = paid - total;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ perspective: '1000px' }}>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-[#fdfbf7] rounded-2xl shadow-2xl w-[500px] max-w-[90vw] overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {isSuccess ? (
          /* Success State */
          <div className="p-8 text-center" dir="rtl">
            <div className="w-16 h-16 rounded-full bg-[#5a8a5a] flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check size={32} color="white" />
            </div>
            <h2 className="text-2xl font-bold text-[#2c2420] mb-2">تم الدفع بنجاح!</h2>
            <p className="text-[#6b5b51] mb-4">شكراً لزيارتك مكتبة العبقري</p>
            <div className="font-mono-receipt text-lg text-[#2c2420] font-bold">
              المبلغ: {total.toFixed(2)} ر.س
            </div>
            {change > 0 && (
              <div className="font-mono-receipt text-sm text-[#5a8a5a] mt-2">
                الباقي: {change.toFixed(2)} ر.س
              </div>
            )}
          </div>
        ) : (
          /* Payment Form */
          <div className="p-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#2c2420]">إتمام الدفع</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-[#f4f1ea] flex items-center justify-center text-[#6b5b51] hover:bg-[#e8e4db] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Payment Methods */}
            <div className="flex gap-3 mb-6">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 animate-slide-up ${
                      selectedMethod === method.id
                        ? 'border-[#d4a574] bg-[#d4a574]/10 scale-105'
                        : 'border-[#c3bcb2] bg-transparent hover:border-[#d4a574]/50'
                    }`}
                    style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                  >
                    <Icon size={24} className={selectedMethod === method.id ? 'text-[#d4a574]' : 'text-[#6b5b51]'} />
                    <span className="text-sm font-medium text-[#2c2420]">{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Amount Display */}
            <div className="bg-[#2c2420] rounded-xl p-4 mb-4 text-center">
              <div className="text-xs text-[#c3bcb2] mb-1">المبلغ الإجمالي</div>
              <div className="font-mono-receipt text-3xl text-[#fdfbf7] font-bold">
                {total.toFixed(2)} <span className="text-lg">ر.س</span>
              </div>
            </div>

            {/* Paid Amount Display */}
            <div className="bg-[#f4f1ea] rounded-xl p-3 mb-4 text-center">
              <div className="text-xs text-[#6b5b51] mb-1">المبلغ المدفوع</div>
              <div className="font-mono-receipt text-2xl text-[#2c2420] font-bold min-h-[2rem]">
                {paidAmount ? `${parseFloat(paidAmount).toFixed(2)} ر.س` : '—'}
              </div>
              {change >= 0 && paidAmount && (
                <div className={`font-mono-receipt text-sm mt-1 ${change >= 0 ? 'text-[#5a8a5a]' : 'text-[#8b4444]'}`}>
                  {change >= 0 ? `الباقي: ${change.toFixed(2)} ر.س` : `متبقي: ${Math.abs(change).toFixed(2)} ر.س`}
                </div>
              )}
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'clear'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleNumpadPress(key)}
                  className="py-3 rounded-lg bg-[#f4f1ea] text-[#2c2420] font-mono-receipt font-bold text-lg hover:bg-[#e8e4db] active:scale-95 transition-all"
                >
                  {key === 'clear' ? 'مسح' : key === 'backspace' ? '⌫' : key}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-lg border-2 border-[#c3bcb2] text-[#6b5b51] font-medium hover:bg-[#f4f1ea] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing || paid < total}
                className="flex-1 py-3 rounded-lg bg-[#2c2420] text-[#fdfbf7] font-bold flex items-center justify-center gap-2 hover:bg-[#3d312c] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? (
                  <span className="animate-pulse">جاري المعالجة...</span>
                ) : (
                  <>
                    <Check size={18} />
                    تأكيد
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
