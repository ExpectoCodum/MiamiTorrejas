import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FloatingItem {
  id: number;
  left: number; // Porcentaje horizontal
  size: number; // Tamaño enpx
  delay: number; // Retardo de animación en seg
  duration: number; // Duración de flotación en seg
}

interface DripItem {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'app-floating-bg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animation-container">
      <!-- CASCADA SUPERFICIAL DE ALMÍBAR EN EL HEADER -->
      <div class="syrup-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1100,70 C1250,130 1380,20 1440,40 L1440,0 L0,0 Z" 
                fill="#d97706" opacity="0.25"/>
          <path d="M0,0 C200,60 400,10 600,50 C800,90 1000,20 1200,60 C1350,90 1400,30 1440,10 L1440,0 L0,0 Z" 
                fill="#e83d84" opacity="0.15"/>
        </svg>
      </div>

      <!-- GOTAS DE ALMÍBAR GOTEYANDO DESDE CUALQUIER PARTE -->
      @for (drip of drips(); track drip.id) {
        <div class="syrup-drip"
             [style.left.%]="drip.left"
             [style.animation-delay.s]="drip.delay"
             [style.animation-duration.s]="drip.duration">
        </div>
      }

      <!-- TORREJAS FLOTANTES -->
      @for (item of items(); track item.id) {
        <div class="floating-torreja"
             [style.left.%]="item.left"
             [style.width.px]="item.size"
             [style.height.px]="item.size"
             [style.animation-delay.s]="item.delay"
             [style.animation-duration.s]="item.duration">
             
             <!-- SVG Iluminado de Torreja Dorada -->
             <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
               <ellipse cx="50" cy="50" rx="42" ry="32" fill="#B45309" transform="rotate(-10 50 50)" />
               <ellipse cx="50" cy="50" rx="38" ry="28" fill="#F59E0B" transform="rotate(-10 50 50)" />
               <!-- Brillo del almíbar -->
               <path d="M25 45 Q 45 25, 70 40 Q 55 55, 25 45 Z" fill="#FDE68A" opacity="0.6" />
               <!-- Anís estrellado decorativo centro -->
               <circle cx="50" cy="50" r="4" fill="#4A2318" />
             </svg>
        </div>
      }
    </div>
  `,
  styles: [`
    .animation-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none; /* No obstaculiza los clics del usuario */
      z-index: 0;
      overflow: hidden;
    }

    /* OLA SUPERIOR */
    .syrup-wave {
      position: absolute;
      top: 0;
      width: 100%;
      line-height: 0;
    }

    /* TORREJAS FLOTANTES */
    .floating-torreja {
      position: absolute;
      bottom: -100px;
      opacity: 0.22;
      filter: drop-shadow(0px 8px 12px rgba(74, 35, 24, 0.15));
      animation: floatUp infinite linear;
    }

    @keyframes floatUp {
      0% {
        transform: translateY(0) rotate(0deg) scale(0.8);
        opacity: 0;
      }
      10% {
        opacity: 0.25;
      }
      90% {
        opacity: 0.25;
      }
      100% {
        transform: translateY(-115vh) rotate(360deg) scale(1.1);
        opacity: 0;
      }
    }

    /* GOTAS DE ALMÍBAR GOTEYANDO */
    .syrup-drip {
      position: absolute;
      top: -20px;
      width: 8px;
      height: 20px;
      background: linear-gradient(180deg, #F59E0B 0%, #D97706 100%);
      border-radius: 0 0 10px 10px;
      opacity: 0;
      box-shadow: 0 2px 5px rgba(217, 119, 6, 0.4);
      animation: dripDown infinite ease-in;
    }

    @keyframes dripDown {
      0% {
        transform: translateY(0) scaleY(1);
        opacity: 0;
      }
      20% {
        opacity: 0.6;
        transform: translateY(100px) scaleY(1.8);
      }
      80% {
        opacity: 0.6;
        transform: translateY(80vh) scaleY(1.2);
      }
      100% {
        transform: translateY(105vh) scaleY(0.8);
        opacity: 0;
      }
    }

    @media (max-width: 899px), (prefers-reduced-motion: reduce), (hover: none) and (pointer: coarse) {
      .animation-container {
        display: none;
      }
    }
  `]
})
export class FloatingBgComponent implements OnInit {
  items = signal<FloatingItem[]>([]);
  drips = signal<DripItem[]>([]);

  ngOnInit() {
    this.generateTorrejas(8); // Genera 8 torrejas flotantes continuas
    this.generateDrips(10);   // Genera 10 gotas de almíbar
  }

  private generateTorrejas(count: number) {
    const list: FloatingItem[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        left: Math.random() * 90 + 5, // Entre 5% y 95% del ancho
        size: Math.random() * 40 + 50, // Tamaños variados entre 50px y 90px
        delay: Math.random() * 12,
        duration: Math.random() * 10 + 14 // Movimiento lento de 14 a 24 segundos
      });
    }
    this.items.set(list);
  }

  private generateDrips(count: number) {
    const list: DripItem[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        left: Math.random() * 94 + 3,
        delay: Math.random() * 15,
        duration: Math.random() * 6 + 6 // Caída de almíbar viscoso (6 a 12 seg)
      });
    }
    this.drips.set(list);
  }
}