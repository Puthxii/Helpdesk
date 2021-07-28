import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteMngComponent } from './site-mng.component';

describe('SiteMngComponent', () => {
  let component: SiteMngComponent;
  let fixture: ComponentFixture<SiteMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
