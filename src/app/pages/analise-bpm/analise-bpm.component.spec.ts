import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseBpmComponent } from './analise-bpm.component';

describe('AnaliseBpmComponent', () => {
  let component: AnaliseBpmComponent;
  let fixture: ComponentFixture<AnaliseBpmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliseBpmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliseBpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
