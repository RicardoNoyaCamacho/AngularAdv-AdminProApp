import { Component, Input } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [],
})
export class DonaComponent {
  @Input() title: string = 'Sin titulo';
  @Input('labels') doughnutChartLabels: Label[] = [
    'Label1',
    'Label2',
    'Label3',
  ];
  @Input('data') doughnutChartData: MultiDataSet = [[0, 0, 0]];

  public colors: Color[] = [
    { backgroundColor: ['#6857e6', '#009fee', '#f02059'] },
  ];
}
