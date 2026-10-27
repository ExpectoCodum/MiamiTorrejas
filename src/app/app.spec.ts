import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('creates the application', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the product catalog before the closed event calculator', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const catalog = host.querySelector('#productos');
    const calculatorToggle = host.querySelector('.calculator-toggle');

    expect(catalog).toBeTruthy();
    expect(calculatorToggle).toBeTruthy();
    expect(catalog!.compareDocumentPosition(calculatorToggle!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(host.querySelector('#calculator-panel')).toBeNull();

    (calculatorToggle as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host.querySelector('#calculator-panel')).toBeTruthy();
    expect(calculatorToggle?.getAttribute('aria-expanded')).toBe('true');
  });

  it('places the event calculator before payment and links catering to the company WhatsApp', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const calculator = host.querySelector('#cotizador');
    const checkout = host.querySelector('.sticky-checkout');
    const cateringLink = host.querySelector<HTMLAnchorElement>('.service-link');
    const paymentAmounts = host.querySelectorAll('.payment-amount');

    expect(calculator).toBeTruthy();
    expect(checkout).toBeTruthy();
    expect(calculator!.compareDocumentPosition(checkout!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(paymentAmounts).toHaveLength(2);
    expect(paymentAmounts[0].textContent).toContain('$20.00');
    expect(paymentAmounts[1].textContent).toContain('$21.40');
    expect(host.querySelector('.payment-note')?.textContent).toContain('no se cobra en este sitio');
    expect(cateringLink?.href).toContain('https://wa.me/17862314086?text=');
    expect(decodeURIComponent(cateringLink?.href ?? '')).toContain('opciones de catering y precios');
    expect(cateringLink?.target).toBe('_blank');
    expect(cateringLink?.rel).toContain('noopener');
  });
});
