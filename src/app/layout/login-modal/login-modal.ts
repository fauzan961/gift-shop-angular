import { Component, ElementRef, HostListener, ViewChildren, QueryList, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AuthService,
  COUNTRY_CODE,
  MOBILE_LENGTH,
  MOBILE_PATTERN,
  OTP_LENGTH,
  RESEND_SECONDS,
} from '../../services/auth';

@Component({
  selector: 'app-login-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css',
})
export class LoginModal {
  readonly auth = inject(AuthService);

  readonly countryCode = COUNTRY_CODE;
  readonly mobileLength = MOBILE_LENGTH;
  readonly otpLength = OTP_LENGTH;
  readonly otpBoxes = Array.from({ length: OTP_LENGTH }, (_, i) => i);

  readonly showDemoHint = true;

  @ViewChildren('otpBox') otpInputs?: QueryList<ElementRef<HTMLInputElement>>;

  step: 'mobile' | 'otp' | 'done' = 'mobile';
  busy = false;
  error = '';

  mobile = new FormControl('', [
    Validators.required,
    Validators.pattern(MOBILE_PATTERN),
  ]);

  otp: string[] = Array(OTP_LENGTH).fill('');

  resendIn = 0;
  private resendTimer?: ReturnType<typeof setInterval>;

  constructor() {
    effect(() => {
      if (this.auth.modalOpen()) this.reset();
      else this.stopResendTimer();
    });
  }

  get mobileInvalid(): boolean {
    return this.mobile.invalid && (this.mobile.dirty || this.mobile.touched);
  }

  onMobileInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '').slice(0, MOBILE_LENGTH);
    el.value = digits;
    this.mobile.setValue(digits);
    this.error = '';
  }

  async sendOtp(): Promise<void> {
    this.mobile.markAsTouched();
    if (this.mobile.invalid || this.busy) return;

    this.busy = true;
    this.error = '';
    try {
      await this.auth.requestOtp(this.mobile.value!);
      this.step = 'otp';
      this.otp = Array(OTP_LENGTH).fill('');
      this.startResendTimer();
      setTimeout(() => this.focusOtp(0));
    } catch {
      this.error = 'Could not send the code. Please try again.';
    } finally {
      this.busy = false;
    }
  }

  onOtpInput(index: number, event: Event): void {
    const el = event.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '');
    this.error = '';

    if (!digits) {
      this.otp[index] = '';
      el.value = '';
      return;
    }

    digits.split('').forEach((d, offset) => {
      const target = index + offset;
      if (target < OTP_LENGTH) this.otp[target] = d;
    });
    this.syncOtpInputs();

    const next = Math.min(index + digits.length, OTP_LENGTH - 1);
    this.focusOtp(next);

    if (this.otpComplete) this.verify();
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      event.preventDefault();
      this.otp[index - 1] = '';
      this.syncOtpInputs();
      this.focusOtp(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusOtp(index - 1);
    } else if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      this.focusOtp(index + 1);
    }
  }

  get otpComplete(): boolean {
    return this.otp.every((d) => d !== '');
  }

  async verify(): Promise<void> {
    if (!this.otpComplete || this.busy) return;

    this.busy = true;
    this.error = '';
    try {
      const ok = await this.auth.verifyOtp(this.otp.join(''));
      if (ok) {
        this.step = 'done';
        this.stopResendTimer();
        setTimeout(() => this.auth.completeLogin(), 900);
      } else {
        this.error = 'That code is not right. Please check and try again.';
        this.otp = Array(OTP_LENGTH).fill('');
        this.syncOtpInputs();
        this.focusOtp(0);
      }
    } catch {
      this.error = 'Could not verify the code. Please try again.';
    } finally {
      this.busy = false;
    }
  }

  async resend(): Promise<void> {
    if (this.resendIn > 0 || this.busy) return;
    this.busy = true;
    try {
      await this.auth.requestOtp(this.auth.otpMobile);
      this.otp = Array(OTP_LENGTH).fill('');
      this.syncOtpInputs();
      this.error = '';
      this.startResendTimer();
      this.focusOtp(0);
    } finally {
      this.busy = false;
    }
  }

  changeNumber(): void {
    this.step = 'mobile';
    this.error = '';
    this.stopResendTimer();
  }

  close(): void {
    this.auth.closeLogin();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.auth.modalOpen() && this.step !== 'done') this.close();
  }

  private reset(): void {
    this.step = 'mobile';
    this.busy = false;
    this.error = '';
    this.otp = Array(OTP_LENGTH).fill('');
    this.mobile.reset('');
    this.stopResendTimer();
  }

  private focusOtp(index: number): void {
    this.otpInputs?.get(index)?.nativeElement.focus();
    this.otpInputs?.get(index)?.nativeElement.select();
  }

  private syncOtpInputs(): void {
    this.otpInputs?.forEach((ref, i) => (ref.nativeElement.value = this.otp[i] ?? ''));
  }

  private startResendTimer(): void {
    this.stopResendTimer();
    this.resendIn = RESEND_SECONDS;
    this.resendTimer = setInterval(() => {
      this.resendIn--;
      if (this.resendIn <= 0) this.stopResendTimer();
    }, 1000);
  }

  private stopResendTimer(): void {
    clearInterval(this.resendTimer);
    this.resendIn = 0;
  }
}
