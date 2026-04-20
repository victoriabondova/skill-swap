import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';
    const date = value?.toDate ? value.toDate() : new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'току що';
    if (seconds < 3600) return `преди ${Math.floor(seconds / 60)} мин`;
    if (seconds < 86400) return `преди ${Math.floor(seconds / 3600)} ч`;
    if (seconds < 2592000) return `преди ${Math.floor(seconds / 86400)} дни`;
    return `преди ${Math.floor(seconds / 2592000)} месеца`;
  }
}