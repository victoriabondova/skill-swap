import { Injectable } from '@angular/core';
import { collection, addDoc, updateDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { db } from '../firebase';
import { SwapRequest } from '../../models/swap-request.model';

@Injectable({
  providedIn: 'root'
})
export class SwapService {
  getSentRequests(userId: string): Observable<SwapRequest[]> {
    return new Observable(observer => {
      const swapsRef = collection(db, 'swaps');
      const q = query(swapsRef, where('fromUserId', '==', userId));
      return onSnapshot(q, (snapshot) => {
        const swaps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SwapRequest[];
        observer.next(swaps);
      }, (error) => observer.error(error));
    });
  }
  getReceivedRequests(userId: string): Observable<SwapRequest[]> {
    return new Observable(observer => {
      const swapsRef = collection(db, 'swaps');
      const q = query(swapsRef, where('toUserId', '==', userId));
      return onSnapshot(q, (snapshot) => {
        const swaps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SwapRequest[];
        observer.next(swaps);
      }, (error) => observer.error(error));
    });
  }
  sendRequest(request: Omit<SwapRequest, 'id'>): Promise<any> {
    return addDoc(collection(db, 'swaps'), request);
  }
  updateRequestStatus(id: string, status: 'accepted' | 'rejected'): Promise<any> {
    return updateDoc(doc(db, 'swaps', id), { status });
  }
}