import { Injectable } from '@angular/core';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { db } from '../firebase';
import { Offer } from '../../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  getOffers(): Observable<Offer[]> {
    return new Observable(observer => {
      const offersRef = collection(db, 'offers');
      return onSnapshot(offersRef, (snapshot) => {
        const offers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Offer[];
        observer.next(offers);
      }, (error) => observer.error(error));
    });
  }
  getOffersByCategory(category: string): Observable<Offer[]> {
    return new Observable(observer => {
      const offersRef = collection(db, 'offers');
      const q = query(offersRef, where('category', '==', category));
      return onSnapshot(q, (snapshot) => {
        const offers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Offer[];
        observer.next(offers);
      }, (error) => observer.error(error));
    });
  }
  getOfferById(id: string): Observable<Offer> {
    return new Observable(observer => {
      const offerRef = doc(db, 'offers', id);
      return onSnapshot(offerRef, (snapshot) => {
        if (snapshot.exists()) {
          observer.next({ id: snapshot.id, ...snapshot.data() } as Offer);
        } else {
          observer.error(new Error('Offer not found'));
        }
      }, (error) => observer.error(error));
    });
  }
  getOffersByUser(userId: string): Observable<Offer[]> {
    return new Observable(observer => {
      const offersRef = collection(db, 'offers');
      const q = query(offersRef, where('ownerId', '==', userId));
      return onSnapshot(q, (snapshot) => {
        const offers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Offer[];
        observer.next(offers);
      }, (error) => observer.error(error));
    });
  }
  createOffer(offer: Omit<Offer, 'id'>): Promise<any> {
    return addDoc(collection(db, 'offers'), offer);
  }
  updateOffer(id: string, offer: Partial<Offer>): Promise<any> {
    return updateDoc(doc(db, 'offers', id), offer);
  }
  deleteOffer(id: string): Promise<any> {
    return deleteDoc(doc(db, 'offers', id));
  }
}