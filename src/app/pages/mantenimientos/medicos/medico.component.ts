import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medico.model';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { delay } from 'rxjs/operators';
import {
  FormGroup,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado?: Hospital;
  public medicoSeleccionado!: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe(({ id }) => {
      this.cargarMedico(id);
    });
    // this.medicoService.getMedicoPorId()

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospiatlId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (h) => h._id === hospiatlId
      );
    });
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }
    this.medicoService
      .getMedicoPorId(id)
      .pipe(delay(100))
      .subscribe(
        (medico) => {
          if (medico) {
            const { nombre } = medico;
            const _id = medico.hospital?._id;
            this.medicoSeleccionado = medico;
            this.medicoForm.setValue({ nombre, hospital: _id });
          }
        },
        (err) => {
          this.router.navigateByUrl(`/dashboard/medicos`);
        }
      );
  }

  cargarHospitales() {
    this.hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      //!Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this.medicoService.actualizarMedicos(data).subscribe((resp) => {
        Swal.fire(
          'Actualizado',
          `${nombre} actualizado correctamente`,
          'success'
        );
      });
    } else {
      //! crear
      this.medicoService
        .crearMedicos(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp._id}`);
        });
    }
  }
}
