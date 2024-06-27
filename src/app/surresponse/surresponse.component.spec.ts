import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurresponseComponent } from './surresponse.component';

describe('SurresponseComponent', () => {
  let component: SurresponseComponent;
  let fixture: ComponentFixture<SurresponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurresponseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurresponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
