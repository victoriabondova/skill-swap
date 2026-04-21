import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { OfferService } from '../../../core/services/offer.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgFor],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  private fb = inject(FormBuilder);
  private offerService = inject(OfferService);
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading = false;
  errorMessage = '';
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
  onSubmit() {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const offer = {
      ...this.offerForm.value,
      ownerId: user.uid,
      ownerName: user.displayName || 'Анонимен',
      createdAt: new Date(),
      status: 'active' as const
    };
    this.offerService.createOffer(offer).then(() => {
      this.router.navigate(['/offers']);
    }).catch(() => {
      this.isLoading = false;
      this.errorMessage = 'Грешка при създаване на офертата. Опитай отново.';
    });
  }
}