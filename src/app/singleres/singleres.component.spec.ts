import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleresComponent } from './singleres.component';

describe('SingleresComponent', () => {
  let component: SingleresComponent;
  let fixture: ComponentFixture<SingleresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
