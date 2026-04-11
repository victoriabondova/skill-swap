import { Component } from '@angular/core';
import { ISkill } from '../../interfaces/skill.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  skills: ISkill[] = [
    {
      _id: '1',
      title: 'Уроци по Python',
      category: 'Програмиране',
      description: 'Предлагам основи на Python срещу уроци по китара.',
      ownerId: 'u1',
      ownerName: 'Иван',
      createdAt: Date.now()
    },
    {
      _id: '2',
      title: 'Уроци по Испански',
      category: 'Езици',
      description: 'Разговорен испански срещу уроци по готвене.',
      ownerId: 'u2',
      ownerName: 'Мария',
      createdAt: Date.now()
    }
  ];
}
