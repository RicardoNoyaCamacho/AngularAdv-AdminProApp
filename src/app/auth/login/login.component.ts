import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from '../../shared/validators/validators.service';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [
        Validators.required,
        Validators.pattern(this.validationService.emailPattern),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private validationService: ValidatorService,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.renderButton();

    if (localStorage.getItem('x-token')) {
      this.router.navigateByUrl('/');
    }
  }

  get emailErrorMsg(): string {
    const errors = this.loginForm.get('email')?.errors;
    if (errors?.required) {
      return 'El email es obligatorio';
    } else if (errors?.pattern) {
      return 'El valor ingresado no tiene formato de un email';
    } else if (errors?.emailTomado) {
      return 'El email ya existe';
    }
    return '';
  }

  campoNoValido(campo: string) {
    if (this.loginForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  login() {
    this.formSubmitted = true;

    this.usuarioService.login(this.loginForm.value).subscribe(
      (resp) => {
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }

        //!Navegar al dashbord
        this.router.navigateByUrl('/');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  onSuccess(googleUser: any) {
    // console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log(id_token);
  }

  onFailure(error: any) {
    console.log(error);
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
      onsuccess: this.onSuccess,
      onfailure: this.onFailure,
    });

    this.startApp();
  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element: any) {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser: any) => {
        const id_token = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(id_token).subscribe((resp) => {
          //!Navegar al dashbord
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          });
        });
      },
      function (error: any) {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
}
