import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from './services/order.service';
import { FloatingBgComponent } from './components/floating-bg.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, FloatingBgComponent],
  template: `
    <!-- Fondo Animado -->
    <app-floating-bg />

    <main class="insta-wrapper">

      <!-- BARRA SUPERIOR -->
      <div class="top-badge animate-fade-down">
        <span>✨ CALIDAD PREMIUM ARTESANAL · EL SABOR DE LA ABUELA ✨</span>
      </div>

      <!-- HERO SPLIT GIGANTE (IZQUIERDA COMIDA / DERECHA MARCA) -->
      <header class="hero-split-section">
        <div class="light-aura"></div>

        <div class="hero-grid">

          <!-- COLUMNA IZQUIERDA: EL ANTOJO VISUAL (IMAGEN FLOTANTE) -->
          <div class="hero-image-col animate-scale-up">
            <div class="food-display-wrapper float-animation">
              <img src="assets/hero-torrejas.png" 
                   alt="Torrejas artesanales con almíbar" 
                   class="hero-food-img"
                   onerror="this.style.display='none'">
              <div class="shadow-base"></div>
            </div>
          </div>

          <!-- COLUMNA DERECHA: IDENTIDAD MONUMENTAL -->
          <div class="hero-text-col animate-fade-up">
            <div class="logo-badge">
              <img src="assets/logo-miami-torrejas.png" alt="Logo Miami Torrejas" onerror="this.style.display='none'">
            </div>

            <span class="script-tagline">El Sabor de la Abuela</span>

            <div class="giant-bg-text">
              <span>MIAMI</span>
              <span>TORREJAS</span>
            </div>

            <p class="hero-subtitle">
              El verdadero sabor cubano, con almíbar artesanal y canela en rama. Hechas para compartir... o no. 😉
            </p>

            <div class="hero-actions">
              <a href="#productos" class="btn-primary-glow">🍽️ VER BANDEJAS</a>
              <a href="#cotizador" class="btn-secondary" (click)="openCalculator()">🎉 COTIZAR EVENTO</a>
            </div>
          </div>

        </div>
      </header>

      <div class="content-container">
        <div id="productos" class="section-title">
          <h2>ELIGE TUS TORREJAS</h2>
          <p>Confirma cantidades y coordina el pago y el envío por WhatsApp</p>
        </div>

        <section class="products-grid">
          <div *ngFor="let product of orderService.products()" class="insta-product-card">
            <div class="img-container">
              <img [src]="product.image" [alt]="product.name">
              <span class="unit-pill">{{ product.unitLabel }}</span>
            </div>

            <div class="card-bottom">
              <h3 class="product-title">{{ product.name | uppercase }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <ng-container *ngIf="product.id === 'regulares'; else miniQuantity">
                <p class="pricing-note">Desde $20 por 10 · suma 5 torrejas por vez</p>
                <div class="variant-list" aria-label="Selecciona cantidades por sabor">
                  <div *ngFor="let variant of orderService.regularVariants" class="variant-row">
                    <div class="variant-info">
                      <span class="variant-name">{{ variant.name }}</span>
                      <span class="variant-total">
                        {{ orderService.quantity(variant.id) }} uds ·
                        {{ orderService.formatCurrency(orderService.lineTotal(variant.id)) }}
                      </span>
                    </div>
                    <div class="qty-selector">
                      <button type="button"
                              [disabled]="orderService.quantity(variant.id) === 0"
                              [attr.aria-label]="'Quitar 5 torrejas ' + variant.name"
                              (click)="orderService.updateQuantity(variant.id, -1)">−</button>
                      <span>{{ orderService.quantity(variant.id) }}</span>
                      <button type="button"
                              class="add"
                              [attr.aria-label]="'Agregar ' +
                                (orderService.quantity(variant.id) === 0 ? 10 : 5) +
                                ' torrejas ' + variant.name"
                              (click)="orderService.updateQuantity(variant.id, 1)">+</button>
                    </div>
                  </div>
                </div>
                <p class="quantity-hint">Cada sabor se cotiza por separado: $2 por unidad.</p>
              </ng-container>

              <ng-template #miniQuantity>
                <div class="mini-price">{{ orderService.formatCurrency(product.price) }} <small>/ bandeja de 24</small></div>
                <div class="mini-quantity-row">
                  <span>{{ orderService.quantity(product.id) }} bandejas ·
                    {{ orderService.formatCurrency(orderService.lineTotal(product.id)) }}</span>
                  <div class="qty-selector">
                    <button type="button"
                            [disabled]="orderService.quantity(product.id) === 0"
                            aria-label="Quitar una bandeja de Mini Torrejas"
                            (click)="orderService.updateQuantity(product.id, -1)">−</button>
                    <span>{{ orderService.quantity(product.id) }}</span>
                    <button type="button"
                            class="add"
                            aria-label="Agregar una bandeja de Mini Torrejas"
                            (click)="orderService.updateQuantity(product.id, 1)">+</button>
                  </div>
                </div>
              </ng-template>
            </div>
          </div>
        </section>

        <section class="services-strip" aria-label="Opciones de servicio">
          <div class="service-item">
            <span class="service-icon" aria-hidden="true">🚚</span>
            <span class="service-copy">
              <h4>Delivery</h4>
              <p>Coordinamos la entrega contigo</p>
            </span>
          </div>
          <div class="divider" aria-hidden="true"></div>
          <div class="service-item">
            <span class="service-icon" aria-hidden="true">📍</span>
            <span class="service-copy">
              <h4>Pick-up</h4>
              <p>Recogida en Flagler</p>
            </span>
          </div>
          <div class="divider" aria-hidden="true"></div>
          <a class="service-item service-link"
             href="https://wa.me/17862314086?text=Hola%2C%20equipo%20de%20Miami%20Torrejas.%20Estoy%20organizando%20una%20celebraci%C3%B3n%20y%20quisiera%20conocer%20sus%20opciones%20de%20catering%20y%20precios.%20%C2%BFMe%20podr%C3%ADan%20orientar%3F%20Muchas%20gracias."
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Consultar opciones y precios de catering por WhatsApp">
            <span class="service-icon" aria-hidden="true">🎉</span>
            <span class="service-copy">
              <h4>Catering</h4>
              <p>Consulta opciones y precios <span class="service-arrow" aria-hidden="true">→</span></p>
            </span>
          </a>
        </section>

        <section id="cotizador" class="calculator-section">
          <button type="button"
                  class="calculator-toggle"
                  [attr.aria-expanded]="calculatorOpen()"
                  aria-controls="calculator-panel"
                  (click)="toggleCalculator()">
            <span>
              <strong>🎉 Cotizar menú para buffet o eventos</strong>
              <small>Calcula una cantidad sugerida para tu celebración</small>
            </span>
            <span class="toggle-icon" aria-hidden="true">{{ calculatorOpen() ? '−' : '+' }}</span>
          </button>

          @if (calculatorOpen()) {
            <div id="calculator-panel" class="card calculator-card">
              <div class="calc-header">
                <h3>Cotizador rápido de eventos</h3>
                <p>Cuéntanos un poco sobre tu celebración y coordinamos los detalles por WhatsApp.</p>
              </div>

              <div class="calc-grid">
                <div class="input-box">
                  <label for="guest-count">👥 ¿Cuántos invitados tendrás?</label>
                  <input id="guest-count"
                         type="number"
                         [ngModel]="orderService.guestsCount()"
                         (ngModelChange)="orderService.guestsCount.set($event)"
                         min="1">
                </div>

                <div class="input-box">
                  <label for="event-date">📅 Fecha del evento</label>
                  <input id="event-date"
                         type="date"
                         [ngModel]="orderService.eventDate()"
                         (ngModelChange)="orderService.eventDate.set($event)">
                </div>

                <div class="input-box">
                  <label for="event-time">⏰ Hora estimada</label>
                  <input id="event-time"
                         type="time"
                         [ngModel]="orderService.eventTime()"
                         (ngModelChange)="orderService.eventTime.set($event)">
                </div>
              </div>

              <div class="recommendation-banner">
                💡 Para <strong>{{ orderService.guestsCount() }} personas</strong>, te sugerimos
                <span class="highlight">{{ orderService.recommendedTrays() }} bandeja(s) mini</span>.
                Ajustamos la cantidad final contigo por WhatsApp.
              </div>
            </div>
          }
        </section>

        <section class="sticky-checkout">
          <div class="delivery-toggle">
            <button type="button"
                    [class.active]="orderService.deliveryMethod() === 'pickup'"
                    [attr.aria-pressed]="orderService.deliveryMethod() === 'pickup'"
                    (click)="orderService.setDeliveryMethod('pickup')">
              📍 Pick-Up en Flagler
            </button>
            <button type="button"
                    [class.active]="orderService.deliveryMethod() === 'delivery'"
                    [attr.aria-pressed]="orderService.deliveryMethod() === 'delivery'"
                    (click)="orderService.setDeliveryMethod('delivery')">
              🚚 Delivery · envío aparte
            </button>
          </div>

          <div class="checkout-summary" aria-label="Resumen de precios">
            <div class="payment-options">
              <div class="payment-option">
                <span class="payment-label">Efectivo</span>
                <strong class="payment-amount">{{ orderService.formatCurrency(orderService.subtotal()) }}</strong>
              </div>
              <div class="payment-option">
                <span class="payment-label">Tarjeta o Zelle</span>
                <strong class="payment-amount">{{ orderService.formatCurrency(orderService.cardZelleTotal()) }}</strong>
                <small class="tax-note">Impuestos incluidos</small>
              </div>
            </div>
            <div class="checkout-notes">
              <span class="shipping-note">
                {{ orderService.deliveryMethod() === 'delivery' ? 'Delivery: envío a convenir' : 'Pick-up en Flagler: sin costo de envío' }}
              </span>
              <span class="payment-note">El pago se coordina por WhatsApp; no se cobra en este sitio.</span>
            </div>
          </div>

          <button type="button"
                  class="whatsapp-btn glow-btn"
                  [disabled]="!orderService.isValidOrder()"
                  (click)="sendToWhatsApp()">
            📲 CONSULTAR Y RESERVAR POR WHATSAPP
          </button>
        </section>
      </div>
      <footer class="site-footer">
        <p>
          Hecho por
          <a href="https://expecto-codum.vercel.app/" target="_blank" rel="noopener noreferrer">
            Expecto Codum
          </a>
        </p>
        <nav class="footer-contact" aria-label="Contacto">
          <a href="https://wa.me/59891355256" target="_blank" rel="noopener noreferrer">
            WhatsApp: +598 9135 5256
          </a>
          <a href="https://t.me/+59891355256" target="_blank" rel="noopener noreferrer">
            Telegram: +598 9135 5256
          </a>
        </nav>
      </footer>
    </main>
  `,
  styles: [`
    :host {
      --pink-bg: #ffdbe8;
      --pink-card: #ffeaf2;
      --pink-dark: #ec4899;
      --pink-intense: #be185d;
      --choco-dark: #3b180e;
      --choco-light: #5c2818;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    /* FONDO DEGRADADO INTENSO */
    .insta-wrapper {
      position: relative;
      z-index: 2;
      min-height: 100vh;
      background: linear-gradient(
        180deg, 
        #ffe4f1 0%, 
        #fbcfe8 25%, 
        #f472b6 65%, 
        #be185d 100%
      );
      padding-bottom: 120px;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }

    /* BARRA SUPERIOR */
    .top-badge {
      text-align: center;
      padding: 12px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(5px);
      font-weight: 800;
      font-size: 0.85rem;
      color: var(--choco-dark);
      letter-spacing: 1.5px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.04);
    }

    /* HERO GRID COMPLETO EN 2 COLUMNAS */
    .hero-split-section {
      position: relative;
      max-width: 1300px;
      margin: 0 auto;
      padding: 60px 20px 80px;
      min-height: 600px;
      display: flex;
      align-items: center;
    }

    .light-aura {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 400px;
      background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,240,245,0.4) 50%, rgba(255,255,255,0) 80%);
      transform: translate(-50%, -50%);
      z-index: 0;
      border-radius: 50%;
      filter: blur(35px);
    }

    .hero-grid {
      position: relative;
      z-index: 5;
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
      width: 100%;
      align-items: center;
    }

    @media (min-width: 900px) {
      .hero-grid {
        grid-template-columns: 1.1fr 1fr;
        gap: 60px;
      }
    }

    /* IMAGEN DE LA COMIDA A LA IZQUIERDA */
    .hero-image-col {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .food-display-wrapper {
      position: relative;
      max-width: 480px;
      width: 100%;
      text-align: center;
    }

    .hero-food-img {
      width: 100%;
      height: auto;
      max-height: 520px;
      object-fit: contain;
      filter: drop-shadow(0 20px 30px rgba(59, 24, 14, 0.3));
    }

    /* Efecto sombra en la base para realce 3D */
    .shadow-base {
      width: 70%;
      height: 25px;
      background: radial-gradient(ellipse at center, rgba(59, 24, 14, 0.4) 0%, rgba(0,0,0,0) 70%);
      margin: -10px auto 0;
      border-radius: 50%;
    }

    /* TEXTO DE MARCA A LA DERECHA */
    .hero-text-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    @media (min-width: 900px) {
      .hero-text-col {
        align-items: flex-start;
        text-align: left;
      }
    }

    .logo-badge {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 10px 20px rgba(59, 24, 14, 0.2);
      overflow: hidden;
      background: #ffc0cb;
      margin-bottom: 16px;
    }

    .logo-badge img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .script-tagline {
      font-family: 'Georgia', serif;
      font-style: italic;
      font-size: clamp(1.4rem, 3vw, 2.2rem);
      color: var(--choco-dark);
      margin-bottom: -10px;
      z-index: 2;
    }

    .giant-bg-text {
      display: flex;
      flex-direction: column;
      line-height: 0.82;
      font-weight: 900;
      font-size: clamp(4rem, 11vw, 7.8rem);
      color: #ffffff;
      text-shadow: 0 15px 35px rgba(190, 24, 93, 0.3), 0 2px 6px rgba(59, 24, 14, 0.15);
      letter-spacing: -3px;
      user-select: none;
      margin-bottom: 16px;
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.15rem);
      font-weight: 600;
      color: var(--choco-dark);
      max-width: 480px;
      line-height: 1.5;
      margin: 0 0 28px;
    }

    /* BOTONES HERO */
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      justify-content: center;
    }

    @media (min-width: 900px) {
      .hero-actions {
        justify-content: flex-start;
      }
    }

    .btn-primary-glow {
      background: var(--pink-dark);
      color: #ffffff;
      text-decoration: none;
      font-weight: 900;
      font-size: 1rem;
      padding: 16px 28px;
      border-radius: 50px;
      box-shadow: 0 10px 25px rgba(236, 72, 153, 0.4);
      transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    }

    .btn-primary-glow:hover {
      background: var(--pink-intense);
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(236, 72, 153, 0.6);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.85);
      color: var(--choco-dark);
      text-decoration: none;
      font-weight: 800;
      font-size: 1rem;
      padding: 16px 24px;
      border-radius: 50px;
      border: 2px solid #fff;
      transition: transform 0.2s, background 0.2s;
    }

    .btn-secondary:hover {
      background: #ffffff;
      transform: translateY(-3px);
    }

    /* CONTENEDOR CENTRAL (COTIZADOR SEPARADO + MENÚ) */
    .content-container {
      max-width: 1050px;
      margin: 0 auto;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    /* TIRA SERVICIOS */
    .services-strip {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #ffffff;
      padding: 24px 10px;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(59, 24, 14, 0.1);
      border-bottom: 6px solid var(--choco-dark);
    }

    .service-item {
      text-align: center;
      flex: 1;
    }

    .service-item h4 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 900;
      color: var(--choco-dark);
      letter-spacing: 1px;
    }

    .service-item p {
      margin: 4px 0 0;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--pink-dark);
    }

    .divider {
      width: 2px;
      height: 35px;
      background: #fbcfe8;
    }

    /* COTIZADOR SEPARADO */
    .calculator-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 20px 40px rgba(59, 24, 14, 0.1);
      border: 3px solid #fff;
      scroll-margin-top: 30px;
    }

    .calc-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .calc-header h3 {
      margin: 0;
      color: var(--choco-dark);
      font-size: 1.8rem;
      font-weight: 900;
    }

    .calc-header p {
      margin: 6px 0 0;
      color: var(--choco-light);
      font-size: 1rem;
    }

    .calc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .input-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .input-box label {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--choco-dark);
    }

    .input-box input {
      padding: 14px;
      border-radius: 14px;
      border: 2px solid #fbcfe8;
      font-size: 1rem;
      font-weight: 600;
      color: var(--choco-dark);
      background: #fff;
      outline: none;
    }

    .input-box input:focus {
      border-color: var(--pink-dark);
      box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.15);
    }

    .recommendation-banner {
      background: #fff0f6;
      border: 2px dashed #f472b6;
      padding: 18px;
      border-radius: 14px;
      text-align: center;
      color: var(--choco-dark);
      font-size: 1rem;
    }

    .highlight {
      color: var(--pink-intense);
      font-weight: 900;
      text-decoration: underline;
    }

    /* PRODUCTOS */
    .section-title {
      text-align: center;
      margin-top: 20px;
      scroll-margin-top: 30px;
    }

    .section-title h2 {
      font-size: 2.2rem;
      font-weight: 900;
      color: var(--choco-dark);
      margin: 0;
      letter-spacing: 1px;
    }

    .section-title p {
      color: var(--choco-dark);
      margin: 6px 0 0;
      font-weight: 700;
      opacity: 0.9;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 28px;
    }

    .insta-product-card {
      background: #ffdbe8;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 15px 30px rgba(59, 24, 14, 0.15);
      border: 4px solid #ffffff;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
    }

    .insta-product-card:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow: 0 25px 45px rgba(59, 24, 14, 0.25);
    }

    .img-container {
      height: 240px;
      position: relative;
      background: #fbcfe8;
      overflow: hidden;
    }

    .img-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .insta-product-card:hover .img-container img {
      transform: scale(1.08);
    }

    .unit-pill {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--choco-dark);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 20px;
    }

    .card-bottom {
      padding: 22px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      background: #ffeaf2;
    }

    .product-title {
      margin: 0 0 6px;
      font-size: 1.3rem;
      font-weight: 900;
      color: var(--choco-dark);
    }

    .product-desc {
      margin: 0 0 18px;
      font-size: 0.9rem;
      color: var(--choco-light);
      flex-grow: 1;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid rgba(59, 24, 14, 0.1);
      padding-top: 16px;
    }

    .price {
      font-size: 1.6rem;
      font-weight: 900;
      color: var(--choco-dark);
    }

    .price small {
      font-size: 0.85rem;
      color: var(--pink-intense);
    }

    .qty-selector {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff;
      padding: 5px;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }

    .qty-selector button {
      width: 38px;
      height: 38px;
      border: none;
      border-radius: 10px;
      background: #f3f4f6;
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--choco-dark);
      cursor: pointer;
    }

    .qty-selector button.add {
      background: var(--pink-dark);
      color: #fff;
    }

    .qty-selector span {
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--choco-dark);
      min-width: 20px;
      text-align: center;
    }

    /* BARRA INFERIOR FLOTANTE */
    .sticky-checkout {
      background: var(--choco-dark);
      color: #ffffff;
      border-radius: 24px;
      padding: 26px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.4);
      border: 3px solid #fbcfe8;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .delivery-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      background: rgba(255,255,255,0.1);
      padding: 6px;
      border-radius: 16px;
    }

    .delivery-toggle button {
      padding: 14px;
      border: none;
      background: transparent;
      color: #ffdbe8;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
    }

    .delivery-toggle button.active {
      background: var(--pink-dark);
      color: #fff;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.15);
      border-bottom: 1px solid rgba(255,255,255,0.15);
      padding: 16px 0;
    }

    .sub-details {
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
      color: #fbcfe8;
    }

    .grand-total {
      font-size: 1.25rem;
      font-weight: 800;
    }

    .grand-total span {
      color: #f472b6;
      font-size: 1.7rem;
      margin-left: 8px;
    }

  `]
})
export class AppComponent {
  orderService: OrderService = inject(OrderService);
  readonly calculatorOpen = signal(false);

  toggleCalculator(): void {
    this.calculatorOpen.update((open) => !open);
  }

  openCalculator(): void {
    this.calculatorOpen.set(true);
  }

  sendToWhatsApp() {
    if (this.orderService.isValidOrder()) {
      const url = this.orderService.generateWhatsAppLink();
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}