import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDetailListComponent } from './upload-detail-list.component';

describe('UploadDetailListComponent', () => {
  let component: UploadDetailListComponent;
  let fixture: ComponentFixture<UploadDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
