import { Injectable, computed, signal } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unitLabel: string;
  quantityLabel: string;
  minimumQuantity: number;
  quantityStep: number;
  image: string;
}

export interface RegularVariant {
  id: 'regulares' | 'anis' | 'canela';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  products = signal<Product[]>([
    {
      id: 'regulares',
      name: 'Torrejas Regulares',
      description: 'Elige cuántas quieres clásicas, con anís o con canela.',
      price: 2,
      unitLabel: 'torreja',
      quantityLabel: 'unidades',
      minimumQuantity: 10,
      quantityStep: 5,
      image: 'assets/regulares.png'
    },
    {
      id: 'mini',
      name: 'Mini Torrejas',
      description: 'Bandeja de 24 mini torrejas, ideal para compartir.',
      price: 50,
      unitLabel: 'bandeja',
      quantityLabel: 'bandejas',
      minimumQuantity: 1,
      quantityStep: 1,
      image: 'assets/mini.png'
    }
  ]);

  readonly regularVariants: RegularVariant[] = [
    { id: 'regulares', name: 'Clásicas' },
    { id: 'anis', name: 'Con anís' },
    { id: 'canela', name: 'Con canela' }
  ];

  guestsCount = signal<number>(15);
  eventDate = signal<string>('');
  eventTime = signal<string>('');
  deliveryMethod = signal<'pickup' | 'delivery'>('pickup');
  cart = signal<Map<string, number>>(new Map([['regulares', 10]]));

  recommendedTrays = computed(() => {
    const guests = this.guestsCount();
    return Math.max(1, Math.ceil(guests / 10));
  });

  subtotal = computed(() => {
    let total = 0;
    const currentCart = this.cart();

    currentCart.forEach((quantity, id) => {
      total += (this.unitPrice(id) ?? 0) * quantity;
    });

    return total;
  });

  cardZelleTotal = computed(() => Math.round(this.subtotal() * 1.07 * 100) / 100);

  isValidOrder = computed(() => this.subtotal() > 0);

  updateQuantity(productId: string, direction: -1 | 1): void {
    const minimumQuantity = this.minimumQuantity(productId);
    if (minimumQuantity === null) {
      return;
    }

    const currentCart = new Map(this.cart());
    const currentQuantity = currentCart.get(productId) ?? 0;
    const newQuantity = direction > 0
      ? currentQuantity === 0
        ? minimumQuantity
        : currentQuantity + this.quantityStep(productId)
      : currentQuantity <= minimumQuantity
        ? 0
        : currentQuantity - this.quantityStep(productId);

    if (newQuantity === 0) {
      currentCart.delete(productId);
    } else {
      currentCart.set(productId, newQuantity);
    }

    this.cart.set(currentCart);
  }

  quantity(productId: string): number {
    return this.cart().get(productId) ?? 0;
  }

  lineTotal(productId: string): number {
    return (this.unitPrice(productId) ?? 0) * this.quantity(productId);
  }

  private unitPrice(productId: string): number | null {
    const product = this.products().find((item) => item.id === productId);
    if (product) {
      return product.price;
    }

    return this.regularVariants.some((variant) => variant.id === productId) ? 2 : null;
  }

  private minimumQuantity(productId: string): number | null {
    const product = this.products().find((item) => item.id === productId);
    if (product) {
      return product.minimumQuantity;
    }

    return this.regularVariants.some((variant) => variant.id === productId) ? 10 : null;
  }

  private quantityStep(productId: string): number {
    const product = this.products().find((item) => item.id === productId);
    return product?.quantityStep ?? 5;
  }

  setDeliveryMethod(method: 'pickup' | 'delivery'): void {
    this.deliveryMethod.set(method);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  generateWhatsAppLink(): string {
    const text = [
      '✨ *COTIZACIÓN - MIAMI TORREJAS* ✨',
      '',
      ...(this.eventDate() ? [`📅 Fecha del evento: ${this.eventDate()}`] : []),
      ...(this.eventTime() ? [`⏰ Hora: ${this.eventTime()}`] : []),
      `👥 Invitados estimados: ${this.guestsCount()}`,
      `📍 Entrega: ${this.deliveryMethod() === 'delivery' ? 'Delivery (costo a convenir)' : 'Pick-Up en Flagler'}`,
      '',
      '*DETALLE DEL PEDIDO:*',
      ...this.regularVariants
        .filter((variant) => this.quantity(variant.id) > 0)
        .map((variant) => `▪️ ${this.quantity(variant.id)} torrejas ${variant.name.toLowerCase()} (${this.formatCurrency(this.lineTotal(variant.id))})`),
      ...(this.quantity('mini') > 0
        ? [`▪️ ${this.quantity('mini')} bandeja(s) de Mini Torrejas (${this.formatCurrency(this.lineTotal('mini'))})`]
        : []),
      '',
      `Subtotal en efectivo: ${this.formatCurrency(this.subtotal())}`,
      `Total con tarjeta o Zelle (incluye impuestos): ${this.formatCurrency(this.cardZelleTotal())}`,
      'Envío: aparte, a convenir por WhatsApp.',
      '',
      'Quisiera consultar disponibilidad y coordinar la reserva y el pago.'
    ].join('\n');

    return `https://wa.me/17862314086?text=${encodeURIComponent(text)}`;
  }
}
