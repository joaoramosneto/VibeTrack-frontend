import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentosComponent } from './experimentos.component';

describe('ExperimentosComponent', () => {
  let component: ExperimentosComponent;
  let fixture: ComponentFixture<ExperimentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperimentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
