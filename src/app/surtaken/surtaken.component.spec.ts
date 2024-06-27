import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurtakenComponent } from './surtaken.component';

describe('SurtakenComponent', () => {
  let component: SurtakenComponent;
  let fixture: ComponentFixture<SurtakenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurtakenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurtakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
