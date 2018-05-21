import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaryawanComponent } from './karyawan.component';

describe('KaryawanComponent', () => {
  let component: KaryawanComponent;
  let fixture: ComponentFixture<KaryawanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaryawanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaryawanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
