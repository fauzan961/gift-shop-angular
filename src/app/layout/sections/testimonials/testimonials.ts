import { Component } from '@angular/core';

interface Testimonial {
  name: string;
  initials: string;
  location: string;
  quote: string;
  rating: number;
}

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  stars = [1, 2, 3, 4, 5];

  testimonials: Testimonial[] = [
    {
      name: 'Layla Al-Sabah',
      initials: 'LA',
      location: 'Kuwait City',
      quote:
        'Ordered a birthday bundle at midnight and it arrived before breakfast. The packaging alone made my sister cry happy tears.',
      rating: 5,
    },
    {
      name: 'Omar Haddad',
      initials: 'OH',
      location: 'Salmiya',
      quote:
        'I am hopeless at picking gifts. The occasion collections did the thinking for me and my wife still talks about it.',
      rating: 5,
    },
    {
      name: 'Sara Mansour',
      initials: 'SM',
      location: 'Hawally',
      quote:
        'Fresh flowers, real chocolate, zero drama. This is the only shop I trust for last minute anniversary saves.',
      rating: 5,
    },
  ];

  stats: Stat[] = [
    { value: '50K+', label: 'Gifts delivered' },
    { value: '4.9/5', label: 'Average rating' },
    { value: '2 hrs', label: 'Express delivery' },
    { value: '120+', label: 'Cities covered' },
  ];
}
