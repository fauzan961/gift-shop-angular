import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, ReactiveFormsModule],
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
      iconSrc: '../../../assets/images/mpgs_logo.png',
    },
    {
      id: 'knet',
      name: 'Knet',
      desc: 'Pay directly from your Kuwaiti bank account',
      iconSrc: '../../../assets/images/knet_logo.png',
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      desc: 'Fast, secure payment with Face ID or Touch ID',
      iconSrc: '../../../assets/images/apple_pay_logo.png',
    },
  ];

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
