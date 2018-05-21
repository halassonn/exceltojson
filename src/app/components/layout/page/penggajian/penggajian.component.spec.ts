import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenggajianComponent } from './penggajian.component';

describe('PenggajianComponent', () => {
  let component: PenggajianComponent;
  let fixture: ComponentFixture<PenggajianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenggajianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenggajianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
