import { 
  Component, 
  OnInit, 
  OnDestroy, 
  PLATFORM_ID, 
  inject, 
  ChangeDetectorRef, 
  NgZone, 
  signal, 
  ElementRef, 
  ViewChild 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class Hero implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private timerId: any = null;

  @ViewChild('hoursEl') hoursEl?: ElementRef<HTMLElement>;
  @ViewChild('minutesEl') minutesEl?: ElementRef<HTMLElement>;
  @ViewChild('secondsEl') secondsEl?: ElementRef<HTMLElement>;

  hours = signal('00');
  minutes = signal('00');
  seconds = signal('00');
  offerExpired = signal(false);

  ngOnInit() {
    this.updateCountdown();
    if (isPlatformBrowser(this.platformId)) {
      // Ejecutamos fuera y dentro de ngZone para asegurar ticks constantes cada segundo
      this.ngZone.runOutsideAngular(() => {
        this.timerId = setInterval(() => {
          this.ngZone.run(() => {
            this.updateCountdown();
          });
        }, 1000);
      });
    }
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  updateCountdown() {
    const now = new Date();
    // Convertir a hora de la zona horaria GMT-6 (Ciudad de México)
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cstNow = new Date(utcNow - 6 * 3600000);

    // Objetivo: 2:00 PM (14:00:00) GMT-6 del día en curso (20:00 UTC)
    let targetUtc = Date.UTC(
      cstNow.getFullYear(),
      cstNow.getMonth(),
      cstNow.getDate(),
      20, 0, 0
    );

    let diff = targetUtc - now.getTime();

    if (diff <= 0) {
      this.hours.set('00');
      this.minutes.set('00');
      this.seconds.set('00');
      this.offerExpired.set(true);
      this.syncDom('00', '00', '00');
      this.cdr.detectChanges();
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const hStr = h.toString().padStart(2, '0');
    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');

    this.hours.set(hStr);
    this.minutes.set(mStr);
    this.seconds.set(sStr);
    this.offerExpired.set(false);

    this.syncDom(hStr, mStr, sStr);
    this.cdr.detectChanges();
  }

  private syncDom(h: string, m: string, s: string) {
    if (this.hoursEl?.nativeElement) this.hoursEl.nativeElement.textContent = h;
    if (this.minutesEl?.nativeElement) this.minutesEl.nativeElement.textContent = m;
    if (this.secondsEl?.nativeElement) this.secondsEl.nativeElement.textContent = s;
  }
}
