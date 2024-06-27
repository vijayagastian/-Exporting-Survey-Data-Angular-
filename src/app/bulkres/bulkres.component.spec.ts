import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkresComponent } from './bulkres.component';

describe('BulkresComponent', () => {
  let component: BulkresComponent;
  let fixture: ComponentFixture<BulkresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
