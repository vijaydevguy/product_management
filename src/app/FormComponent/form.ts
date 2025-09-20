import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/service';

import {
  gmailValidator,
  strongPasswordValidator,
} from '../FormComponent/validator';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

// this below code is helps us to bind between html and logic
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrls: ['./form.css'],
})
export class FormComponent {
  // title = 'my-app';

  //below @input helps us to bind inputs dynamically as per our form type
  //by default it is signin mode
  @Input() mode: 'signin' | 'signup' = 'signin'; // default mode

  //we will handle form using FormGroup build in method
  form: FormGroup;

  //Reactive form A FormGroup is a collection of FormControls that track the value and validation status of a group of inputs.

  //we will use like in ui to bind formControlName ="email" like wise it will bind
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,

    //we are injecting services
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, gmailValidator()]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required, strongPasswordValidator()]], // used only for signup
      name: ['', [Validators.required]], // used only for signup
    });
  }

  ngOnInit() {
    // Subscribe to route data changes
    this.route.data.subscribe((data) => {
      this.mode = data['mode'] || 'signin';

      // Add or remove validators depending on mode
      if (this.mode === 'signup') {
        this.form
          .get('confirmPassword')
          ?.setValidators([Validators.required, strongPasswordValidator()]);
        this.form.get('name')?.setValidators([Validators.required]);
      } else {
        this.form.get('confirmPassword')?.clearValidators();
        this.form.get('name')?.clearValidators();
      }

      this.form.get('confirmPassword')?.updateValueAndValidity();
      this.form.get('name')?.updateValueAndValidity();

      // Reset the form when mode changes
      this.form.reset();
    });
  }

  // Helper to check if field has error
  hasError(controlName: string, errorName: string) {
    const control = this.form.get(controlName);
    return control?.touched && control.hasError(errorName);
  }

  //onSubmit when we will submit data's we will get form form
  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    //we will use to test data's sending properly or not
    if (this.mode === 'signin') {
      console.log('Sign In Data:', this.form.value);
    } else {
      console.log('Sign Up Data:', this.form.value);
    }

    // destructuring values
    const { email, password } = this.form.value;

    if (this.mode === 'signin') {
      this.authService
        .signIn(email, password)
        .then(() => this.router.navigate(['/products']))
        .catch((err) => console.error(err));
    } else {
      this.authService
        .signUp(email, password)
        .then(() => this.router.navigate(['/products']))
        .catch((err) => console.error(err));
    }
  }
}
