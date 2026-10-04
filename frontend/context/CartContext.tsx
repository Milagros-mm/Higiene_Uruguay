'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Product, CartItem } from '@/types';
import { STORE } from '@/frontend/utils/store';

const CART_STORAGE_KEY = 'higiene_uruguay_cart';

interface FreeShippingInfo {
  threshold: number;
  remaining: number;
  percentage: number;
  isEligible: boolean;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoaded: boolean;
  totalItems: number;
  subtotal: number;
  hasInquiryItems: boolean;
  freeShipping: FreeShippingInfo;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, selectedUnit?: string) => void;
  removeItem: (productId: string, selectedUnit?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedUnit?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Cargar carrito desde localStorage al montar en cliente
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error('Error cargando carrito desde localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Guardar en localStorage ante cualquier cambio (una vez montado)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error guardando carrito en localStorage', e);
    }
  }, [items, isLoaded]);

  // Controles del Drawer
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  // Agregar producto al carrito
  const addItem = useCallback(
    (product: Product, quantity: number = 1, customUnit?: string) => {
      // Determinar la unidad comercial (para sueltos: bulkPresentation o bulkUnit; para envasados: 'Unidad')
      const unit =
        customUnit ||
        product.bulkPresentation ||
        product.bulkUnit ||
        (product.isBulk ? 'Presentación fijada' : 'Unidad');

      const unitPrice = product.price;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.product.id === product.id && item.selectedUnit === unit
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          const current = updated[existingIndex];
          const newQty = current.quantity + quantity;
          updated[existingIndex] = {
            ...current,
            quantity: newQty,
            totalPrice: newQty * current.price,
          };
          return updated;
        }

        const newItem: CartItem = {
          product,
          quantity,
          selectedUnit: unit,
          price: unitPrice,
          totalPrice: unitPrice * quantity,
        };

        return [...prevItems, newItem];
      });

      // Abrir el carrito automáticamente para dar feedback visual al usuario
      setIsOpen(true);
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

  const freeShipping = useMemo(() => {
    const threshold = STORE.freeShippingThreshold;
    const remaining = Math.max(0, threshold - subtotal);
    const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));
    return {
      threshold,
      remaining,
      percentage,
      isEligible: subtotal >= threshold,
    };
  }, [subtotal]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      isLoaded,
      totalItems,
      subtotal,
      hasInquiryItems,
      freeShipping,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      isOpen,
      isLoaded,
      totalItems,
      subtotal,
      hasInquiryItems,
      freeShipping,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
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
