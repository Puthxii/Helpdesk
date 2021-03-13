import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDetailFormComponent } from './upload-detail-form.component';

describe('UploadDetailFormComponent', () => {
  let component: UploadDetailFormComponent;
  let fixture: ComponentFixture<UploadDetailFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDetailFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
