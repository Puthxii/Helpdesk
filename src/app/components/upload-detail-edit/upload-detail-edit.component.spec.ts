import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDetailEditComponent } from './upload-detail-edit.component';

describe('UploadDetailEditComponent', () => {
  let component: UploadDetailEditComponent;
  let fixture: ComponentFixture<UploadDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
