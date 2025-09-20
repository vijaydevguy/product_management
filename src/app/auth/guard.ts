import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn().pipe(
    map((loggedIn) => {

      //if already loggedin it will throws true
    //   console.log(loggedIn);
    
      if (!loggedIn) {
        router.navigate(['/signin']);
        return false;
      }
      return true;
    })
  );
};
