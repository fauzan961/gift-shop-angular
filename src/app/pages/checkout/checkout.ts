import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

function requiredTrimmed(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value === 'string' && value.trim().length === 0) {
      return { required: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  messageLength = 0;
  selectedPayment: string = '';

  deliveryForm = new FormGroup({
    deliveryAddress: new FormControl('', [Validators.required, requiredTrimmed(), Validators.minLength(5)]),
    city: new FormControl('', [Validators.required, requiredTrimmed(), Validators.minLength(3)]),
    blockArea: new FormControl('', [Validators.required, requiredTrimmed(), Validators.minLength(3)]),
    deliveryDate: new FormControl('', Validators.required),
    preferredTime: new FormControl('', Validators.required),
    recipientName: new FormControl('', [Validators.required, requiredTrimmed()]),
    message: new FormControl('', Validators.maxLength(200)),
  });


  timeSlots = [
    '9:00 AM – 12:00 PM',
    '12:00 PM – 3:00 PM',
    '3:00 PM – 6:00 PM',
    '6:00 PM – 9:00 PM',
  ];

  paymentMethods = [
    {
      id: 'mpgs',
      name: 'Credit / debit card',
      desc: 'Visa, Mastercard — powered by MPGS',
      iconSrc: '/assets/images/mpgs_logo.png',
    },
    {
      id: 'knet',
      name: 'Knet',
      desc: 'Pay directly from your Kuwaiti bank account',
      iconSrc: '/assets/images/knet_logo.png',
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      desc: 'Fast, secure payment with Face ID or Touch ID',
      iconSrc: '/assets/images/apple_pay_logo.png',
    },
  ];

  /** Placeholder order — should come from the same cart service as /cart. */
  orderItems = [
    { name: 'Red Rose Grand Bouquet', qty: 1, price: 18.5, image: '/assets/images/flowers.jpg' },
    { name: 'Belgian Chocolate Luxury Box', qty: 2, price: 12.5, image: '/assets/images/chocolates.jpg' },
    { name: 'Cuddly Teddy Bear Classic', qty: 1, price: 9, image: '/assets/images/toy.webp' },
  ];

  readonly deliveryFee = 2;
  readonly freeDeliveryFrom = 25;

  get itemCount(): number {
    return this.orderItems.reduce((n, i) => n + i.qty, 0);
  }

  get subtotal(): number {
    return this.orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  get delivery(): number {
    return this.subtotal >= this.freeDeliveryFrom ? 0 : this.deliveryFee;
  }

  get total(): number {
    return this.subtotal + this.delivery;
  }

  onMessageInput(event: Event) {
    this.messageLength = (event.target as HTMLTextAreaElement).value.length;
  }

  isFormValid(): boolean {
    return this.deliveryForm.valid;
  }

  selectPayment(id: string) {
    this.selectedPayment = id;
  }

  formatPrice(price: number): string {
    return 'KD ' + price.toFixed(3);
  }

  onProceed(){
    console.log('PAY')
  }

}
