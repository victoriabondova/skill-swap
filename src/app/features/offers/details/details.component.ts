import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OfferService } from '../../../core/services/offer.service';
import { SwapService } from '../../../core/services/swap.service';
import { AuthService } from '../../../core/services/auth.service';
import { Offer } from '../../../models/offer.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { switchMap } from 'rxjs/operators';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, ReactiveFormsModule, TimeAgoPipe, SpinnerComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private offerService = inject(OfferService);
  private swapService = inject(SwapService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  offer: Offer | null = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  showSwapForm = false;
  isOwner = false;
  currentUser: any = null;
  swapForm: FormGroup = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(10)]]
  });
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.cdr.detectChanges();
    });
    this.route.params.pipe(
      switchMap(params => this.offerService.getOfferById(params['id']))
    ).subscribe({
      next: (offer) => {
        this.offer = offer;
        this.isOwner = this.currentUser?.uid === offer.ownerId;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Офертата не е намерена.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  deleteOffer() {
    if (!this.offer?.id) return;
    if (!confirm('Сигурен ли си че искаш да изтриеш тази оферта?')) return;
    this.offerService.deleteOffer(this.offer.id).then(() => {
      this.router.navigate(['/offers']);
    }).catch(() => {
      this.errorMessage = 'Грешка при изтриване.';
      this.cdr.detectChanges();
    });
  }
  sendSwapRequest() {
    if (this.swapForm.invalid) {
      this.swapForm.markAllAsTouched();
      return;
    }
    if (!this.currentUser || !this.offer) return;
    const request = {
      offerId: this.offer.id!,
      offerTitle: this.offer.title,
      fromUserId: this.currentUser.uid,
      fromUserName: this.currentUser.displayName,
      toUserId: this.offer.ownerId,
      message: this.swapForm.value.message,
      status: 'pending' as const,
      createdAt: new Date()
    };
    this.swapService.sendRequest(request).then(() => {
      this.successMessage = 'Заявката е изпратена успешно!';
      this.showSwapForm = false;
      this.swapForm.reset();
      this.cdr.detectChanges();
    }).catch(() => {
      this.errorMessage = 'Грешка при изпращане на заявката.';
      this.cdr.detectChanges();
    });
  }
}