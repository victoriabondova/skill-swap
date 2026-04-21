import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { OfferService } from '../../../core/services/offer.service';
import { Offer } from '../../../models/offer.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, TimeAgoPipe, SpinnerComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class CatalogComponent implements OnInit {
  private offerService = inject(OfferService);
  private cdr = inject(ChangeDetectorRef);
  offers: Offer[] = [];
  isLoading = true;
  selectedCategory = '';
  errorMessage = '';
  categories = ['Всички', 'Програмиране', 'Музика', 'Езици', 'Дизайн', 'Академично', 'Спорт', 'Готварство', 'Фотография'];
  ngOnInit() {
    this.offerService.getOffers().subscribe({
      next: (offers) => {
        this.offers = offers;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Грешка при зареждане.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  filterByCategory(category: string) {
    this.selectedCategory = category === 'Всички' ? '' : category;
    this.isLoading = true;
    if (!this.selectedCategory) {
      this.offerService.getOffers().subscribe({
        next: (offers) => {
          this.offers = offers;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Грешка при зареждане.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.offerService.getOffersByCategory(this.selectedCategory).subscribe({
        next: (offers) => {
          this.offers = offers;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Грешка при зареждане.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}