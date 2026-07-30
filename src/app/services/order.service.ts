import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  description: string;
  pricePerTray: number;
  unitsPerTray: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Configuración de productos con las rutas exactas a los assets
  products = signal<Product[]>([
    {
      id: 'regulares',
      name: 'Torrejas Regulares',
      description: 'Estilo tradicional cubano en almíbar denso.',
      pricePerTray: 35,
      unitsPerTray: 12,
      image: 'assets/regulares.png' // <-- Apuntando a public/assets/regulares.png
    },
    {
      id: 'mini',
      name: 'Mini Torrejas',
      description: 'Ideales para eventos, mesas de postre y finger food.',
      pricePerTray: 40,
      unitsPerTray: 24,
      image: 'assets/mini.png' // <-- Apuntando a public/assets/mini.png
    },
    {
      id: 'anis',
      name: 'Torrejas de Anís',
      description: 'Sabor especial aromatizado con anís estrellado.',
      pricePerTray: 38,
      unitsPerTray: 12,
      image: 'assets/anis.png' // <-- Apuntando a public/assets/anis.png
    }
  ]);

  guestsCount = signal<number>(15);
  eventDate = signal<string>('');
  eventTime = signal<string>('');
  deliveryMethod = signal<'pickup' | 'delivery'>('pickup');
  
  cart = signal<Map<string, number>>(new Map());

  recommendedTrays = computed(() => {
    const guests = this.guestsCount();
    return Math.max(1, Math.ceil(guests / 10));
  });

  updateQuantity(productId: string, delta: number) {
    const currentCart = new Map(this.cart());
    const currentQty = currentCart.get(productId) || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    if (newQty === 0) {
      currentCart.delete(productId);
    } else {
      currentCart.set(productId, newQty);
    }
    this.cart.set(currentCart);
  }

  setDeliveryMethod(method: 'pickup' | 'delivery') {
    this.deliveryMethod.set(method);
  }

  subtotal = computed(() => {
    let total = 0;
    const currentCart = this.cart();
    const prods = this.products();

    currentCart.forEach((qty, id) => {
      const prod = prods.find(p => p.id === id);
      if (prod) {
        total += prod.pricePerTray * qty;
      }
    });
    return total;
  });

  shippingCost = computed(() => {
    return this.deliveryMethod() === 'delivery' ? 15 : 0;
  });

  grandTotal = computed(() => {
    return this.subtotal() + this.shippingCost();
  });

  isValidOrder = computed(() => {
    return this.subtotal() > 0;
  });

  generateWhatsAppLink(): string {
    const phone = '+1786231-4086'; // Reemplaza con tu número real
    let text = `✨ *NUEVA COTIZACIÓN - MIAMI TORREJAS* ✨\n\n`;
    
    if (this.eventDate()) {
      text += `📅 Fecha: ${this.eventDate()}\n`;
    }
    if (this.eventTime()) {
      text += `⏰ Hora: ${this.eventTime()}\n`;
    }
    text += `👥 Invitados estimados: ${this.guestsCount()}\n`;
    text += `📍 Método: ${this.deliveryMethod() === 'delivery' ? 'Delivery en Miami' : 'Pick-Up en Flagler'}\n\n`;
    text += `*DETALLE DE BANDEJAS:* \n`;

    const currentCart = this.cart();
    const prods = this.products();

    currentCart.forEach((qty, id) => {
      const prod = prods.find(p => p.id === id);
      if (prod && qty > 0) {
        text += `▪️ ${qty}x ${prod.name} (\${${prod.pricePerTray * qty} USD})\n`;
      }
    });

    text += `\nSubtotal: \${${this.subtotal()} USD}\n`;
    text += `Envío: \${${this.shippingCost()} USD}\n`;
    text += `*TOTAL ESTIMADO: \${${this.grandTotal()} USD}*`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }
}