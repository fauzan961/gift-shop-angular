import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth';

export type AddressLabel = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  label: AddressLabel;
  address: string;
  blockArea: string;
  city: string;
  isDefault: boolean;
}

export interface Preferences {
  orderSms: boolean;
  occasionReminders: boolean;
  offersEmail: boolean;
}

export interface Profile {
  fullName: string;
  email: string;
  /** yyyy-mm-dd, or '' when not set. */
  birthday: string;
  addresses: Address[];
  preferences: Preferences;
}

const EMPTY_PROFILE: Profile = {
  fullName: '',
  email: '',
  birthday: '',
  addresses: [],
  preferences: { orderSms: true, occasionReminders: true, offersEmail: false },
};

/**
 * Account details for the signed-in user, stored per mobile number.
 * FRONT-END STUB: persists to localStorage; swap load/persist for API calls.
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly auth = inject(AuthService);

  /** Bumped after every write so `profile` re-reads storage. */
  private readonly version = signal(0);

  readonly profile = computed<Profile | null>(() => {
    this.version();
    const user = this.auth.user();
    return user ? this.load(user.mobile) : null;
  });

  // ---------- Details ----------

  saveDetails(details: Pick<Profile, 'fullName' | 'email' | 'birthday'>): void {
    this.update((p) => ({
      ...p,
      fullName: details.fullName.trim(),
      email: details.email.trim(),
      birthday: details.birthday,
    }));
  }

  // ---------- Addresses ----------

  addAddress(input: Omit<Address, 'id'>): void {
    this.update((p) => {
      // The first address saved is always the default.
      const isDefault = input.isDefault || p.addresses.length === 0;
      const address: Address = { ...input, id: this.newId(), isDefault };
      const others = isDefault ? p.addresses.map((a) => ({ ...a, isDefault: false })) : p.addresses;
      return { ...p, addresses: [...others, address] };
    });
  }

  updateAddress(id: string, input: Omit<Address, 'id'>): void {
    this.update((p) => {
      let addresses = p.addresses.map((a) => (a.id === id ? { ...input, id } : a));
      if (input.isDefault) addresses = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
      return { ...p, addresses: this.ensureDefault(addresses) };
    });
  }

  setDefaultAddress(id: string): void {
    this.update((p) => ({
      ...p,
      addresses: p.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    }));
  }

  removeAddress(id: string): void {
    this.update((p) => ({
      ...p,
      addresses: this.ensureDefault(p.addresses.filter((a) => a.id !== id)),
    }));
  }

  // ---------- Preferences ----------

  setPreference(key: keyof Preferences, value: boolean): void {
    this.update((p) => ({ ...p, preferences: { ...p.preferences, [key]: value } }));
  }

  // ---------- Internals ----------

  /** Removing or un-defaulting the default must promote another address. */
  private ensureDefault(addresses: Address[]): Address[] {
    if (!addresses.length || addresses.some((a) => a.isDefault)) return addresses;
    return addresses.map((a, i) => ({ ...a, isDefault: i === 0 }));
  }

  private update(change: (p: Profile) => Profile): void {
    const user = this.auth.user();
    const current = this.profile();
    if (!user || !current) return;
    this.persist(user.mobile, change(current));
    this.version.update((v) => v + 1);
  }

  private key(mobile: string): string {
    return `mawada.profile.${mobile}`;
  }

  private load(mobile: string): Profile {
    try {
      const raw = localStorage.getItem(this.key(mobile));
      if (!raw) return structuredClone(EMPTY_PROFILE);
      const stored = JSON.parse(raw) as Partial<Profile>;
      return {
        ...structuredClone(EMPTY_PROFILE),
        ...stored,
        preferences: { ...EMPTY_PROFILE.preferences, ...stored.preferences },
      };
    } catch {
      return structuredClone(EMPTY_PROFILE);
    }
  }

  private persist(mobile: string, profile: Profile): void {
    try {
      localStorage.setItem(this.key(mobile), JSON.stringify(profile));
    } catch {
      /* storage unavailable — changes last until refresh */
    }
  }

  private newId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
}
