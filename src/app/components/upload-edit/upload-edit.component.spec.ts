import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEditComponent } from './upload-edit.component';

describe('UploadEditComponent', () => {
  let component: UploadEditComponent;
  let fixture: ComponentFixture<UploadEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
