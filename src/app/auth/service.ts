import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  authState,
} from '@angular/fire/auth';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  user$: Observable<any> = authState(this.auth);

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return this.auth.signOut().then(() => this.router.navigate(['/signin']));
  }
}
