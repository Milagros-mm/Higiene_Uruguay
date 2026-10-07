'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Product, CartItem } from '@/types';
import {
  STORE,
  StorePromotionConfig,
  getStoredPromotionConfig,
  DEFAULT_PROMOTION_CONFIG,
} from '@/frontend/utils/store';

const CART_STORAGE_KEY = 'higiene_uruguay_cart';

export interface PromoProgressInfo {
  threshold: number;
  remaining: number;
  percentage: number;
  isReached: boolean;
  discountPercent: number;
  discountAmount: number;
  benefitTitle: string;
  bannerText: string;
  isActive: boolean;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoaded: boolean;
  totalItems: number;
  subtotal: number;
  discountedSubtotal: number;
  hasInquiryItems: boolean;
  promoProgress: PromoProgressInfo;
  promoConfig: StorePromotionConfig;
  lastAddedItem: CartItem | null;
  isMiniPopupOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  closeMiniPopup: () => void;
  addItem: (product: Product, quantity?: number, selectedUnit?: string) => void;
  removeItem: (productId: string, selectedUnit?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedUnit?: string) => void;
  clearCart: () => void;
  refreshPromoConfig: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Notificación tipo mini cuadro debajo del carrito
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [isMiniPopupOpen, setIsMiniPopupOpen] = useState(false);

  // Configuración de la promoción configurable desde el panel admin
  const [promoConfig, setPromoConfig] = useState<StorePromotionConfig>(DEFAULT_PROMOTION_CONFIG);

  const refreshPromoConfig = useCallback(() => {
    setPromoConfig(getStoredPromotionConfig());
  }, []);

  // 1. Cargar carrito y promoConfig desde localStorage al montar en cliente
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
      refreshPromoConfig();
    } catch (e) {
      console.error('Error cargando carrito desde localStorage', e);
    } finally {
      setIsLoaded(true);
    }

    const handlePromoUpdate = () => refreshPromoConfig();
    window.addEventListener('promo-config-updated', handlePromoUpdate);
    window.addEventListener('storage', handlePromoUpdate);
    return () => {
      window.removeEventListener('promo-config-updated', handlePromoUpdate);
      window.removeEventListener('storage', handlePromoUpdate);
    };
  }, [refreshPromoConfig]);

  // 2. Guardar carrito en localStorage ante cambios
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error guardando carrito en localStorage', e);
    }
  }, [items, isLoaded]);

  // Controles del Drawer lateral
  const openCart = useCallback(() => {
    setIsMiniPopupOpen(false); // Cerrar mini popup si se abre el drawer completo
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMiniPopup = useCallback(() => setIsMiniPopupOpen(false), []);

  // Agregar producto al carrito:
  // IMPORTANTE: NO abre la barra lateral, sino que abre el mini cuadro flotante bajo el carrito
  const addItem = useCallback(
    (product: Product, quantity: number = 1, customUnit?: string) => {
      const unit =
        customUnit ||
        product.bulkPresentation ||
        product.bulkUnit ||
        (product.isBulk ? 'Presentación fijada' : 'Unidad');

      const unitPrice = product.price;

      let addedCartItem: CartItem = {
        product,
        quantity,
        selectedUnit: unit,
        price: unitPrice,
        totalPrice: unitPrice * quantity,
      };

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.product.id === product.id && item.selectedUnit === unit
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          const current = updated[existingIndex];
          const newQty = current.quantity + quantity;
          const updatedItem = {
            ...current,
            quantity: newQty,
            totalPrice: newQty * current.price,
          };
          updated[existingIndex] = updatedItem;
          addedCartItem = updatedItem;
          return updated;
        }

        return [...prevItems, addedCartItem];
      });

      // Mostrar el pequeño cuadrito debajo del carrito (en lugar de abrir el drawer lateral)
      setLastAddedItem(addedCartItem);
      setIsMiniPopupOpen(true);

      // Auto-ocultar el mini popup a los 4 segundos
      setTimeout(() => {
        setIsMiniPopupOpen(false);
      }, 4000);
    },
    []
  );

  // Quitar producto del carrito
  const removeItem = useCallback((productId: string, selectedUnit?: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => {
        if (item.product.id !== productId) return true;
        if (selectedUnit && item.selectedUnit !== selectedUnit) return true;
        return false;
      })
    );
  }, []);

  // Modificar cantidad (+ / -)
  const updateQuantity = useCallback(
    (productId: string, quantity: number, selectedUnit?: string) => {
      if (quantity <= 0) {
        removeItem(productId, selectedUnit);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) => {
          const matches =
            item.product.id === productId && (!selectedUnit || item.selectedUnit === selectedUnit);

          if (!matches) return item;

          return {
            ...item,
            quantity,
            totalPrice: quantity * item.price,
          };
        })
      );
    },
    [removeItem]
  );

  // Vaciar carrito
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Cálculos derivados
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items]
  );

  const hasInquiryItems = useMemo(
    () => items.some((item) => item.product.requiresStockInquiry || item.product.isBulk),
    [items]
  );

  // Progreso de la promoción configurada por el admin
  const promoProgress: PromoProgressInfo = useMemo(() => {
    const threshold = promoConfig.thresholdAmount || 25000;
    const remaining = Math.max(0, threshold - subtotal);
    const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));
    const isReached = promoConfig.isActive && subtotal >= threshold;
    const discountAmount = isReached ? Math.round(subtotal * (promoConfig.discountPercent / 100)) : 0;

    return {
      threshold,
      remaining,
      percentage,
      isReached,
      discountPercent: promoConfig.discountPercent,
      discountAmount,
      benefitTitle: promoConfig.benefitTitle,
      bannerText: promoConfig.bannerText,
      isActive: promoConfig.isActive,
    };
  }, [subtotal, promoConfig]);

  const discountedSubtotal = useMemo(
    () => Math.max(0, subtotal - promoProgress.discountAmount),
    [subtotal, promoProgress.discountAmount]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      isLoaded,
      totalItems,
      subtotal,
      discountedSubtotal,
      hasInquiryItems,
      promoProgress,
      promoConfig,
      lastAddedItem,
      isMiniPopupOpen,
      openCart,
      closeCart,
      toggleCart,
      closeMiniPopup,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refreshPromoConfig,
    }),
    [
      items,
      isOpen,
      isLoaded,
      totalItems,
      subtotal,
      discountedSubtotal,
      hasInquiryItems,
      promoProgress,
      promoConfig,
      lastAddedItem,
      isMiniPopupOpen,
      openCart,
      closeCart,
      toggleCart,
      closeMiniPopup,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refreshPromoConfig,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
}
