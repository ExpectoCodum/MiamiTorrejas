export interface Product {
  id: string;
  name: string;
  description: string;
  pricePerTray: number; // Precio por bandeja
  unitsPerTray: number; // Cantidad de torrejas por bandeja
  image: string;
}

export interface OrderItem {
  product: Product;
  trays: number; // Número de bandejas seleccionadas
}

export type DeliveryMethod = 'pickup' | 'delivery';

export interface CustomerOrder {
  items: OrderItem[];
  deliveryMethod: DeliveryMethod;
  eventDate: string;
  eventTime: string;
  guestsCount: number;
  notes?: string;
}