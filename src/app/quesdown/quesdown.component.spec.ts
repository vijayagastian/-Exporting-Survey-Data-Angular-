import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesdownComponent } from './quesdown.component';

describe('QuesdownComponent', () => {
  let component: QuesdownComponent;
  let fixture: ComponentFixture<QuesdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuesdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuesdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
