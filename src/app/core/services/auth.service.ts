import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { auth, db } from '../firebase';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<FirebaseUser | null> = new Observable(observer => {
    return onAuthStateChanged(auth, observer);
  });
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map(u => !!u)
  );
  register(email: string, password: string, displayName: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(auth, email, password).then(async (credential) => {
        await updateProfile(credential.user, { displayName });
        const userData: User = {
          uid: credential.user.uid,
          email: credential.user.email!,
          displayName,
          createdAt: new Date()
        };
        await setDoc(doc(db, 'users', credential.user.uid), userData);
        return credential;
      })
    );
  }
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(auth, email, password));
  }
  logout(): Observable<any> {
    return from(signOut(auth));
  }
  getCurrentUser() {
    return auth.currentUser;
  }
}