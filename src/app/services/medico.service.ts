import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MedicoInterface, Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('x-token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  cargarMedicos() {
    const url = `${base_url}/medicos`;
    return this.http
      .get<MedicoInterface>(url, this.headers)
      .pipe(map((resp: MedicoInterface) => resp.medicos));
  }

  getMedicoPorId(id: string) {
    const url = `${base_url}/medicos/${id}`;
    return this.http
      .get<Medico>(url, this.headers)
      .pipe(map((resp: Medico) => resp));
  }

  crearMedicos(medico: { nombre: string; hospital: string }) {
    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedicos(medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  eliminarMedicos(_id: string) {
    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
