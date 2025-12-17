import { Component, inject, signal, WritableSignal, PLATFORM_ID, OnInit, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, AfterViewInit {
  private readonly cookieService = inject(CookieService);
  private readonly platformId = inject(PLATFORM_ID);

  isDark: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
      const theme = this.cookieService.get('theme');
      if (theme === 'dark') {
        this.isDark.set(true);
      }
      this.applyTheme();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupMobileMenu();
    }
  }

  setupMobileMenu(): void {
    const toggleButton = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
    const mobileMenu = document.getElementById('navbar-sticky');

    if (toggleButton && mobileMenu) {
      toggleButton.addEventListener('click', () => {
        const isOpen = mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== '0px';
        
        if (isOpen) {
          // Close menu with animation
          mobileMenu.style.maxHeight = '0';
        } else {
          // Open menu with animation
          mobileMenu.style.maxHeight = '500px';
        }
      });
    }
  }

  toggleTheme() {
    this.isDark.set(!this.isDark());
    this.cookieService.set('theme', this.isDark() ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
    }
  }
}
