import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  mobile: string;
}

export const COUNTRY_CODE = '+965';
export const MOBILE_LENGTH = 8;
export const MOBILE_PATTERN = /^[569]\d{7}$/;

export const OTP_LENGTH = 4;
export const RESEND_SECONDS = 30;
const DEMO_OTP = '1234';
const STORAGE_KEY = 'mawada.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<AuthUser | null>(this.restore());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  readonly displayMobile = computed(() => {
    const m = this._user()?.mobile;
    return m ? `${COUNTRY_CODE} ${m.slice(0, 4)} ${m.slice(4)}` : '';
  });

  private readonly _modalOpen = signal(false);
  readonly modalOpen = this._modalOpen.asReadonly();

  private readonly _modalReason = signal('');
  readonly modalReason = this._modalReason.asReadonly();

  private pendingAction: (() => void) | null = null;

  openLogin(reason = '', afterLogin?: () => void): void {
    this._modalReason.set(reason);
    this.pendingAction = afterLogin ?? null;
    this._modalOpen.set(true);
    this.lockScroll(true);
  }

  closeLogin(): void {
    this._modalOpen.set(false);
    this._modalReason.set('');
    this.pendingAction = null;
    this.pendingMobile = '';
    this.lockScroll(false);
  }


  completeLogin(): void {
    const action = this.pendingAction;
    this._modalOpen.set(false);
    this._modalReason.set('');
    this.pendingAction = null;
    this.lockScroll(false);
    action?.();
  }

  requireLogin(reason: string, action: () => void): void {
    if (this.isLoggedIn()) action();
    else this.openLogin(reason, action);
  }

  private pendingMobile = '';

  get otpMobile(): string {
    return this.pendingMobile;
  }

  async requestOtp(mobile: string): Promise<void> {
    this.pendingMobile = mobile;
    await this.delay(600);
    console.log(`[auth stub] OTP for ${COUNTRY_CODE}${mobile} is ${DEMO_OTP}`);
  }

  async verifyOtp(code: string): Promise<boolean> {
    await this.delay(600);
    if (code !== DEMO_OTP) return false;

    const user: AuthUser = { mobile: this.pendingMobile };
    this._user.set(user);
    this.persist(user);
    this.pendingMobile = '';
    return true;
  }

  logout(): void {
    this._user.set(null);
    this.persist(null);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  private lockScroll(locked: boolean): void {
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  private restore(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private persist(user: AuthUser | null): void {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  }
}
