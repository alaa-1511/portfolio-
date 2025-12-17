import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import {NgxTypedJsModule} from 'ngx-typed-js';
import emailjs from '@emailjs/browser';
import { ToastrService } from 'ngx-toastr';
import * as AOS from 'aos';


@Component({
  selector: 'app-landing',
  imports: [CarouselModule, NgxTypedJsModule, ReactiveFormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit, AfterViewInit  {
   private readonly fb = inject(FormBuilder);
   private toastr = inject(ToastrService);
  contactForm!: FormGroup;

  @ViewChild('statsSection') statsSection!: ElementRef;
  clientsCount = 0;
  projectsCount = 0;
  reviewsCount = 0;
  hasAnimated = false;

ngOnInit(): void {
  this.form();
    AOS.init({
        duration: 1000,
        once: false,
      });
}

ngAfterViewInit() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.hasAnimated) {
        this.animateStats();
        this.hasAnimated = true;
      }
    });
  }, { threshold: 0.5 });

  if (this.statsSection) {
    observer.observe(this.statsSection.nativeElement);
  }
}

animateStats() {
  this.animateValue(0, 80, 2000, (val) => this.clientsCount = val);
  this.animateValue(0, 200, 2000, (val) => this.projectsCount = val);
  this.animateValue(0, 99, 2000, (val) => this.reviewsCount = val);
}

animateValue(start: number, end: number, duration: number, callback: (val: number) => void) {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    callback(Math.floor(progress * (end - start) + start));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
 
  form():void{
 this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      budget: [''],
      message: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.contactForm.valid) {
      const templateParams = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
        budget: this.contactForm.value.budget,
        message: this.contactForm.value.message
      };

      emailjs.send('service_uhvwfbb', 'template_9kqzzu5', templateParams, {
          publicKey: 'HmVEfd9rlmh1aBHI4',
        })
        .then(
          (response) => {
            console.log('SUCCESS!', response.status, response.text);
            this.toastr.success('Message sent successfully!', 'Success');
            this.contactForm.reset();
          },
          (err) => {
            console.log('FAILED...', err);
            this.toastr.error('Failed to send message: ' + JSON.stringify(err), 'Error');
          },
        );
    } else {
      console.log('Form is invalid');
      this.contactForm.markAllAsTouched();
    }
  }

 customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    smartSpeed: 1000,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: true,
    navSpeed: 700,
    margin: 20,
    navText: [
      '<span class="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:text-white text-primary shadow-md hover:bg-primary/80 transition-all"><i class=\'fa-solid fa-arrow-left\'></i></span>',
      '<span class="w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:text-primary text-white shadow-md hover:bg-white/80 transition-all"><i class=\'fa-solid fa-arrow-right\'></i></span>'
    ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    }
  }

  makePhoneCall() {
    window.open('tel:+201201670643', '_self');
  }

  sendEmail() {
    window.open('mailto:ahmedhasanien1999@gmail.com', '_self');
  }
}
