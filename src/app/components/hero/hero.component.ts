import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
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
  private timerId: any = null;

  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';
  offerExpired: boolean = false;

  ngOnInit() {
    this.updateCountdown();
    if (isPlatformBrowser(this.platformId)) {
      this.timerId = setInterval(() => {
        this.updateCountdown();
      }, 1000);
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
      this.hours = '00';
      this.minutes = '00';
      this.seconds = '00';
      this.offerExpired = true;
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    this.hours = h.toString().padStart(2, '0');
    this.minutes = m.toString().padStart(2, '0');
    this.seconds = s.toString().padStart(2, '0');
    this.offerExpired = false;
  }
}
