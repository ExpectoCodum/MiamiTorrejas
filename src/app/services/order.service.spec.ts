import { OrderService } from './order.service';

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  it('starts with ten classic torrejas and increases each option by five', () => {
    expect(orderService.quantity('regulares')).toBe(10);
    expect(orderService.lineTotal('regulares')).toBe(20);
    expect(orderService.subtotal()).toBe(20);

    orderService.updateQuantity('regulares', 1);
    expect(orderService.quantity('regulares')).toBe(15);
    expect(orderService.subtotal()).toBe(30);
    expect(orderService.cardZelleTotal()).toBe(32.1);

    orderService.updateQuantity('regulares', 1);
    expect(orderService.quantity('regulares')).toBe(20);
    expect(orderService.subtotal()).toBe(40);
  });

  it('tracks classic, anise, and cinnamon quantities independently', () => {
    orderService.updateQuantity('anis', 1);
    orderService.updateQuantity('canela', 1);

    expect(orderService.quantity('regulares')).toBe(10);
    expect(orderService.quantity('anis')).toBe(10);
    expect(orderService.quantity('canela')).toBe(10);
    expect(orderService.subtotal()).toBe(60);
    expect(orderService.cardZelleTotal()).toBe(64.2);
  });

  it('removes only the selected variant when decrementing its minimum quantity', () => {
    orderService.updateQuantity('anis', 1);
    orderService.updateQuantity('anis', -1);
    expect(orderService.quantity('anis')).toBe(0);
    expect(orderService.quantity('regulares')).toBe(10);
    expect(orderService.subtotal()).toBe(20);
  });

  it('keeps delivery separate in the WhatsApp quote', () => {
    orderService.setDeliveryMethod('delivery');

    const url = orderService.generateWhatsAppLink();
    const message = decodeURIComponent(url.split('?text=')[1] ?? '');

    expect(url.startsWith('https://wa.me/17862314086?text=')).toBe(true);
    expect(message).toContain('10 torrejas clásicas ($20.00)');
    expect(message).toContain('Subtotal en efectivo: $20.00');
    expect(message).toContain('Total con tarjeta o Zelle (incluye impuestos): $21.40');
    expect(message).toContain('Envío: aparte, a convenir por WhatsApp.');
  });
});
