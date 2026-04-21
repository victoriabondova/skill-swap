import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SwapService } from '../../core/services/swap.service';
import { AuthService } from '../../core/services/auth.service';
import { SwapRequest } from '../../models/swap-request.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-swaps',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, TimeAgoPipe],
  templateUrl: './swaps.component.html',
  styleUrl: './swaps.component.css'
})
export class SwapsComponent implements OnInit {
  private swapService = inject(SwapService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  sentRequests: SwapRequest[] = [];
  receivedRequests: SwapRequest[] = [];
  isLoading = true;
  activeTab: 'received' | 'sent' = 'received';
  currentUser: any = null;
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        combineLatest([
          this.swapService.getReceivedRequests(user.uid),
          this.swapService.getSentRequests(user.uid)
        ]).subscribe({
          next: ([received, sent]) => {
            this.receivedRequests = received;
            this.sentRequests = sent;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
  acceptRequest(id: string) {
    this.swapService.updateRequestStatus(id, 'accepted').then(() => {
      const req = this.receivedRequests.find(r => r.id === id);
      if (req) req.status = 'accepted';
      this.cdr.detectChanges();
    });
  }
  rejectRequest(id: string) {
    this.swapService.updateRequestStatus(id, 'rejected').then(() => {
      const req = this.receivedRequests.find(r => r.id === id);
      if (req) req.status = 'rejected';
      this.cdr.detectChanges();
    });
  }
  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return '⏳ Изчакване';
      case 'accepted': return '✅ Приета';
      case 'rejected': return '❌ Отхвърлена';
      default: return status;
    }
  }
}