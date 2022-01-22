import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ValidatorService } from '../../shared/validators/validators.service';
import { FileUploadService } from '../../services/file-upload.service';
import { UsuarioService } from '../../services/usuario.service';

import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  public perfilFormName!: FormGroup;
  public perfilFormEmail!: FormGroup;
  public usuario: Usuario;
  public imagenSubida!: File;
  public imgTemp: any = '';

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilFormName = this.fb.group({
      nombre: [
        this.usuario.nombre,
        [
          Validators.required,
          Validators.pattern(this.validatorService.nombreApellidoPatter),
        ],
      ],
    });
    this.perfilFormEmail = this.fb.group({
      email: [
        this.usuario.email,
        [
          Validators.required,
          Validators.pattern(this.validatorService.emailPattern),
        ],
      ],
    });
  }

  actualizarNombre() {
    this.usuarioService
      .actualizarNombre(this.perfilFormName.value)
      .subscribe(() => {
        const { nombre } = this.perfilFormName.value;
        Swal.fire('Success', 'Usuario actualizado correctamente', 'success');
        this.usuario.nombre = nombre;
      });
  }

  actualizarEmail() {
    this.usuarioService.actualizarEmail(this.perfilFormEmail.value).subscribe(
      () => {
        const { email } = this.perfilFormEmail.value;
        Swal.fire('Success', 'Usuario actualizado correctamente', 'success');
        this.usuario.email = email;
      },
      (err) => Swal.fire('Error', err.error.errors[0].msg, 'error')
    );
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
    this.fileUploadService
      .actualizarFoto(this.imagenSubida, 'usuarios', this.usuario.uid!)
      .then((img) => {
        this.usuario.img = img;
        Swal.fire('Success', 'Imagen actualizada correctamente', 'success');
      })
      .catch((err) => {
        Swal.fire('Success', 'No se pudo subir la imagen', 'success');
      });
  }
}
