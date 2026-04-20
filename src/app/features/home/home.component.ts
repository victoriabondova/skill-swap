import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('heroAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('categoriesAnimation', [
      transition(':enter', [
        query('.category-card', [
          style({ opacity: 0, transform: 'scale(0.8)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent {
  categories = [
    { icon: '💻', name: 'Програмиране' },
    { icon: '🎵', name: 'Музика' },
    { icon: '🌍', name: 'Езици' },
    { icon: '🎨', name: 'Дизайн' },
    { icon: '📚', name: 'Академично' },
    { icon: '🏋️', name: 'Спорт' },
    { icon: '🍳', name: 'Готварство' },
    { icon: '📸', name: 'Фотография' },
  ];
}