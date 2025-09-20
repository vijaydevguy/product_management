import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ✅ Email must end with @gmail.com
export function gmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    return value.endsWith('@gmail.com') ? null : { gmail: true };
  };
}

// ✅ Password: one uppercase, one lowercase, one special char, min 6 length
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasLength = value.length >= 6;

    return hasUpper && hasLower && hasSpecial && hasLength
      ? null
      : { strongPassword: true };
  };
}


