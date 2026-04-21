import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { OfferService } from '../../core/services/offer.service';
import { Offer } from '../../models/offer.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, TimeAgoPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private offerService = inject(OfferService);
  private cdr = inject(ChangeDetectorRef);
  offers: Offer[] = [];
  isLoading = true;
  currentUser: any = null;
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.cdr.detectChanges();
      if (user) {
        this.offerService.getOffersByUser(user.uid).subscribe({
          next: (offers) => {
            this.offers = offers;
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
  deleteOffer(id: string) {
    if (!confirm('Сигурен ли си че искаш да изтриеш тази оферта?')) return;
    this.offerService.deleteOffer(id).then(() => {
      this.offers = this.offers.filter(o => o.id !== id);
      this.cdr.detectChanges();
    });
  }
}