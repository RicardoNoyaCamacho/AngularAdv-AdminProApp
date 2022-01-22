import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor() {}

  get token(): string {
    return localStorage.getItem('x-token') || '';
  }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ) {
    try {
      const url = `${base_url}/uploads/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('archivo', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': this.token,
        },
        body: formData,
      });

      const data = await resp.json();
      if (data) {
        return data.img;
      } else {
        console.log(data);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
