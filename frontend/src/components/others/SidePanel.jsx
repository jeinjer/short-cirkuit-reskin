import React from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function SidePanel({ onClose, title }) {
  const { isAuthenticated } = useAuth();
  const { items, summary, updateCartItem, removeCartItem, clearCart } = useCart();
  const navigate = useNavigate();

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' }
  };

  const goToProduct = (sku) => {
    if (!sku) return;
    onClose();
    navigate(`/producto/${sku}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-60 backdrop-blur-[1px]"
      />

      <motion.div
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
        className="fixed right-0 top-0 h-full w-[90%] sm:w-[430px] bg-[#0a0a0e] border-l border-white/10 z-70 shadow-2xl flex flex-col"
      >
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#0a0a0e]">
          <h2 className="text-white font-bold flex items-center gap-2">
            <ShoppingCart size={18} className="text-cyan-500" /> {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 p-5 text-gray-500 flex flex-col items-center justify-center gap-4">
            <ShoppingCart size={40} className="opacity-20" />
            <p>Inicia sesión para usar el carrito</p>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="text-cyan-400 text-sm hover:underline cursor-pointer"
            >
              Ir a login
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-5 text-gray-500 flex flex-col items-center justify-center gap-4">
            <ShoppingCart size={40} className="opacity-20" />
            <p>Tu carrito está vacío</p>
            <button onClick={onClose} className="text-cyan-400 text-sm hover:underline cursor-pointer">
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => goToProduct(item.product.sku)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goToProduct(item.product.sku);
                    }
                  }}
                  className="bg-[#111118] border border-white/10 rounded-xl p-3 cursor-pointer hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex gap-3">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-contain bg-white rounded-lg p-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] text-cyan-500">{item.product.sku}</p>
                      <p className="text-sm text-white leading-tight line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-gray-400 mt-1">${Number(item.unitPriceArs || 0).toLocaleString('es-AR')}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCartItem(item.product.id, Math.max(1, item.quantity - 1));
                        }}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-mono text-sm text-white min-w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCartItem(item.product.id, item.quantity + 1);
                        }}
                        disabled={item.quantity >= (item.product.stockAvailable || 0)}
                        title={item.quantity >= (item.product.stockAvailable || 0) ? `Stock Máximo: ${item.product.stockAvailable}` : 'Sumar unidad'}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold text-sm">${Number(item.subtotalArs || 0).toLocaleString('es-AR')}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCartItem(item.product.id);
                        }}
                        className="w-7 h-7 rounded-lg bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 flex items-center justify-center text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#0a0a0e] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Items</span>
                <span className="font-mono text-white">{summary.totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-200 font-bold">Total ARS</span>
                <span className="font-black text-cyan-400">${summary.totalArs.toLocaleString('es-AR')}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="flex-1 h-11 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-gray-300 hover:text-white text-sm font-bold cursor-pointer"
                >
                  Vaciar
                </button>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-black flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}


