import { Component, OnInit } from '@angular/core';

import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  public imagenSubida!: File;
  public imgTemp: any = '';

  constructor(
    public modalImagenService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(file: any) {
    if (file?.target?.files[0]) {
      this.imagenSubida = file?.target?.files[0];
    }

    if (!file?.target?.files[0]) {
      return (this.imgTemp = null);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file?.target?.files[0]);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
    return true;
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubida, tipo, id)
      .then((img) => {
        Swal.fire('Success', 'Imagen actualizada correctamente', 'success');

        this.modalImagenService.nuevaImagen.emit(img);

        this.cerrarModal();
      })
      .catch((err) => {
        Swal.fire('Success', 'No se pudo subir la imagen', 'success');
      });
  }
}
