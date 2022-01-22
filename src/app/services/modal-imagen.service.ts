import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {
  private _ocultarModal: boolean = true;
  public tipo!: 'usuarios' | 'medicos' | 'hospitales';
  public id: string = '';
  public img: string = '';

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,
    img: string = ''
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;

    if (this.img.includes('https')) {
      this.img = img;
    } else {
      this.img =
        'https://res.cloudinary.com/dfz7ok73b/image/upload/v1632932566/no-image/no-image_qydohn.jpg';
    }
  }

  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() {}
}
