import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagen',
})
export class ImagenPipe implements PipeTransform {
  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {
    if (!img) {
      return 'https://res.cloudinary.com/dfz7ok73b/image/upload/v1632932566/no-image/no-image_qydohn.jpg';
    } else if (img?.includes('http')) {
      return img;
    } else {
      return 'https://res.cloudinary.com/dfz7ok73b/image/upload/v1632932566/no-image/no-image_qydohn.jpg';
    }
  }
}
