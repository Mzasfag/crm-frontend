import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, statusTerm: string): any[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    return items.filter((item) => {
      // 1. فلترة الـ Status (لو مختار قيمة، نقارنها، لو فاضية أو "all" نعديها)
      const matchesStatus =
        !statusTerm ||
        statusTerm === '' ||
        (item.status && item.status.toLowerCase() === statusTerm.toLowerCase());

      // 2. فلترة النص العادي (يبحث في الـ name, email, companyName, title أو أي حقل)
      const query = searchTerm ? searchTerm.toLowerCase().trim() : '';
      const matchesSearch =
        !query ||
        Object.values(item).some(
          (val) => val && typeof val === 'string' && val.toLowerCase().includes(query),
        );

      // الشرطين لازم يتحققوا مع بعض
      return matchesStatus && matchesSearch;
    });
  }
}
