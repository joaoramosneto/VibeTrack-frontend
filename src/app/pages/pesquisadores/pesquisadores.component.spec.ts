import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisadoresComponent } from './pesquisadores.component';

describe('PesquisadoresComponent', () => {
  let component: PesquisadoresComponent;
  let fixture: ComponentFixture<PesquisadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PesquisadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
