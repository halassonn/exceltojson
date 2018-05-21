import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatakantorComponent } from './datakantor.component';

describe('DatakantorComponent', () => {
  let component: DatakantorComponent;
  let fixture: ComponentFixture<DatakantorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatakantorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatakantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
