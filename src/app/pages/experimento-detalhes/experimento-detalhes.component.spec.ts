import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentoDetalhesComponent } from './experimento-detalhes.component';

describe('ExperimentoDetalhesComponent', () => {
  let component: ExperimentoDetalhesComponent;
  let fixture: ComponentFixture<ExperimentoDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentoDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
