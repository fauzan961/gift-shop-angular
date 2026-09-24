import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Address, AddressLabel, Preferences, ProfileService } from '../../services/profile';

type Section = 'details' | 'addresses' | 'preferences';

/** Same rule checkout uses: whitespace alone doesn't count as filled in. */
function requiredTrimmed(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  return typeof v === 'string' && v.trim().length === 0 ? { required: true } : null;
}

@Component({
  selector: 'app-account',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  readonly auth = inject(AuthService);
  readonly profiles = inject(ProfileService);
  private readonly router = inject(Router);

  section: Section = 'details';

  /** `short` labels are for the phone segmented control, where space is tight. */
  readonly nav: { key: Section; label: string; short: string; hint: string }[] = [
    { key: 'details', label: 'Personal details', short: 'Details', hint: 'Name, email, birthday' },
    { key: 'addresses', label: 'Saved addresses', short: 'Addresses', hint: 'Where we deliver' },
    { key: 'preferences', label: 'Notifications', short: 'Alerts', hint: 'What we send you' },
  ];

  readonly labels: AddressLabel[] = ['Home', 'Work', 'Other'];
  readonly today = new Date().toISOString().slice(0, 10);

  // ---------- Personal details ----------

  detailsForm = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.minLength(2)],
    }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    birthday: new FormControl('', { nonNullable: true }),
  });

  detailsSaved = false;

  // ---------- Addresses ----------

  addressForm = new FormGroup({
    label: new FormControl<AddressLabel>('Home', { nonNullable: true }),
    address: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.minLength(5)],
    }),
    blockArea: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.minLength(3)],
    }),
    city: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.minLength(3)],
    }),
    isDefault: new FormControl(false, { nonNullable: true }),
  });

  /** Id of the address being edited, 'new' while adding, null when closed. */
  editingId: string | null = null;
  /** Id awaiting a second click before it's deleted. */
  confirmRemoveId: string | null = null;

  // ---------- Preferences ----------

  readonly prefs: { key: keyof Preferences; title: string; body: string }[] = [
    { key: 'orderSms', title: 'Order updates by SMS', body: 'Dispatch, out-for-delivery and delivered alerts.' },
    { key: 'occasionReminders', title: 'Occasion reminders', body: 'A nudge a week before the dates you care about.' },
    { key: 'offersEmail', title: 'Offers & new arrivals', body: 'Seasonal picks and the odd discount, by email.' },
  ];

  prefSaved = false;
  private flashTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Mirror stored details into the form — but never over unsaved edits.
    effect(() => {
      const p = this.profiles.profile();
      if (p && !this.detailsForm.dirty) {
        this.detailsForm.reset({ fullName: p.fullName, email: p.email, birthday: p.birthday });
      }
    });
  }

  // ---------- Derived ----------

  get firstName(): string {
    return this.profiles.profile()?.fullName.trim().split(/\s+/)[0] ?? '';
  }

  get initials(): string {
    const name = this.profiles.profile()?.fullName.trim() ?? '';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  }

  get addresses(): Address[] {
    return this.profiles.profile()?.addresses ?? [];
  }

  /** Profile completeness: name, email, birthday and one saved address. */
  get checklist(): { label: string; done: boolean; section: Section }[] {
    const p = this.profiles.profile();
    return [
      { label: 'Add your name', done: !!p?.fullName.trim(), section: 'details' },
      { label: 'Add your email', done: !!p?.email, section: 'details' },
      { label: 'Add your birthday', done: !!p?.birthday, section: 'details' },
      { label: 'Save an address', done: !!p?.addresses.length, section: 'addresses' },
    ];
  }

  get completion(): number {
    const list = this.checklist;
    return Math.round((list.filter((c) => c.done).length / list.length) * 100);
  }

  get nextStep() {
    return this.checklist.find((c) => !c.done) ?? null;
  }

  showError(form: FormGroup, name: string): boolean {
    const c = form.get(name);
    return !!c && c.invalid && c.touched;
  }

  // ---------- Navigation ----------

  goTo(section: Section): void {
    this.section = section;
    this.closeAddressForm();
  }

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  // ---------- Details actions ----------

  saveDetails(): void {
    this.detailsForm.markAllAsTouched();
    if (this.detailsForm.invalid) return;

    this.profiles.saveDetails(this.detailsForm.getRawValue());
    this.detailsForm.markAsPristine();
    this.flash('details');
  }

  discardDetails(): void {
    const p = this.profiles.profile();
    if (!p) return;
    this.detailsForm.reset({ fullName: p.fullName, email: p.email, birthday: p.birthday });
  }

  // ---------- Address actions ----------

  openNewAddress(): void {
    this.confirmRemoveId = null;
    this.editingId = 'new';
    this.addressForm.reset({
      label: 'Home',
      address: '',
      blockArea: '',
      city: '',
      isDefault: this.addresses.length === 0,
    });
  }

  editAddress(a: Address): void {
    this.confirmRemoveId = null;
    this.editingId = a.id;
    this.addressForm.reset({
      label: a.label,
      address: a.address,
      blockArea: a.blockArea,
      city: a.city,
      isDefault: a.isDefault,
    });
  }

  saveAddress(): void {
    this.addressForm.markAllAsTouched();
    if (this.addressForm.invalid || !this.editingId) return;

    const v = this.addressForm.getRawValue();
    const input = {
      label: v.label,
      address: v.address.trim(),
      blockArea: v.blockArea.trim(),
      city: v.city.trim(),
      isDefault: v.isDefault,
    };

    if (this.editingId === 'new') this.profiles.addAddress(input);
    else this.profiles.updateAddress(this.editingId, input);

    this.closeAddressForm();
  }

  closeAddressForm(): void {
    this.editingId = null;
  }

  makeDefault(a: Address): void {
    this.profiles.setDefaultAddress(a.id);
  }

  /** First click arms, second click deletes — no accidental removals. */
  removeAddress(a: Address): void {
    if (this.confirmRemoveId === a.id) {
      this.profiles.removeAddress(a.id);
      this.confirmRemoveId = null;
      if (this.editingId === a.id) this.closeAddressForm();
    } else {
      this.confirmRemoveId = a.id;
    }
  }

  // ---------- Preference actions ----------

  togglePref(key: keyof Preferences): void {
    const current = this.profiles.profile()?.preferences[key] ?? false;
    this.profiles.setPreference(key, !current);
    this.flash('prefs');
  }

  private flash(which: 'details' | 'prefs'): void {
    clearTimeout(this.flashTimer);
    if (which === 'details') this.detailsSaved = true;
    else this.prefSaved = true;
    this.flashTimer = setTimeout(() => {
      this.detailsSaved = false;
      this.prefSaved = false;
    }, 2200);
  }
}
