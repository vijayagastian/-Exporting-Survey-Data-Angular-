import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StusurveyComponent } from './stusurvey.component';

describe('StusurveyComponent', () => {
  let component: StusurveyComponent;
  let fixture: ComponentFixture<StusurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StusurveyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StusurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
