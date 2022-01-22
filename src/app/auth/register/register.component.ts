import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { ValidatorService } from '../../shared/validators/validators.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted = false;

  public registerForm = this.fb.group(
    {
      nombre: [
        'Test Cien',
        [
          Validators.required,
          Validators.pattern(this.validationService.nombreApellidoPatter),
        ],
      ],
      email: [
        'test100@test.com',
        [
          Validators.required,
          Validators.pattern(this.validationService.emailPattern),
        ],
      ],
      password: ['1234567', [Validators.required, Validators.minLength(6)]],
      password2: ['1234567', [Validators.required, Validators.minLength(6)]],
      terminos: [false, Validators.required],
    },
    {
      validators: [
        this.validationService.camposIguales('password', 'password2'),
      ],
    }
  );

  constructor(
    private fb: FormBuilder,
    private validationService: ValidatorService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  get nombreErrorMsg(): string {
    const errors = this.registerForm.get('nombre')?.errors;
    if (errors?.required) {
      return 'El nombre es obligatorio';
    } else if (errors?.pattern) {
      return 'El valor ingresado no tiene formato de Nombre y Apellido';
    }
    return '';
  }

  get emailErrorMsg(): string {
    const errors = this.registerForm.get('email')?.errors;
    if (errors?.required) {
      return 'El email es obligatorio';
    } else if (errors?.pattern) {
      return 'El valor ingresado no tiene formato de un email';
    }
    // else if (errors?.emailTomado) {
    // return "El email ya existe"
    // }
    return '';
  }

  crearUsuario() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    //Realizar posteo
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      (resp) => {
        //!Navegar al dashbord
        this.router.navigateByUrl('/');
      },
      (err) => Swal.fire('Error', err.error.errors[0].msg, 'error')
    );
  }

  campoNoValido(campo: string) {
    if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }
}
