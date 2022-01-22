import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe((medicos) => {
      this.cargando = false;
      this.medicos = medicos;
    });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarMedicos();
    }
    this.busquedaService.buscar('medicos', termino).subscribe((resp) => {
      this.medicos = resp;
    });
    return true;
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
    }).then((result) => {
      if(result.value) {
        this.medicoService.eliminarMedicos(medico._id!).subscribe(
          (resp) => {
            this.cargarMedicos();
            Swal.fire(
              'Usuario borrado',
              `${medico.nombre} fue eliminado correctamente`,
              'success'
            );
          },
          (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          }
        );
      }
    });
  }
}
