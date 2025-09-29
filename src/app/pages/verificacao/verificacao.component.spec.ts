import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacaoComponent } from './verificacao.component';

describe('VerificacaoComponent', () => {
  let component: VerificacaoComponent;
  let fixture: ComponentFixture<VerificacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
