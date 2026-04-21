import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { OfferService } from '../../../core/services/offer.service';
import { AuthService } from '../../../core/services/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgFor],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private offerService = inject(OfferService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  offerId = '';
  categories = ['Програмиране', 'Музика', 'Езици', 'Дизайн', 'Академично', 'Спорт', 'Готварство', 'Фотография'];
  offerForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    category: ['', Validators.required],
    offering: ['', [Validators.required, Validators.minLength(3)]],
    seeking: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(20)]]
  });
  get title() { return this.offerForm.get('title'); }
  get category() { return this.offerForm.get('category'); }
  get offering() { return this.offerForm.get('offering'); }
  get seeking() { return this.offerForm.get('seeking'); }
  get description() { return this.offerForm.get('description'); }
  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        this.offerId = params['id'];
        return this.offerService.getOfferById(this.offerId);
      })
    ).subscribe({
      next: (offer) => {
        const user = this.authService.getCurrentUser();
        if (user?.uid !== offer.ownerId) {
          this.router.navigate(['/offers']);
          return;
        }
        this.offerForm.patchValue({
          title: offer.title,
          category: offer.category,
          offering: offer.offering,
          seeking: offer.seeking,
          description: offer.description
        });
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
  onSubmit() {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.errorMessage = '';
    this.offerService.updateOffer(this.offerId, this.offerForm.value).then(() => {
      this.router.navigate(['/offers', this.offerId]);
    }).catch(() => {
      this.isSaving = false;
      this.errorMessage = 'Грешка при запазване. Опитай отново.';
      this.cdr.detectChanges();
    });
  }
}