import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDialogComponent } from './single-dialog.component';

describe('SingleDialogComponent', () => {
  let component: SingleDialogComponent;
  let fixture: ComponentFixture<SingleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
