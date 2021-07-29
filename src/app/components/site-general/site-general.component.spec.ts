import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteGeneralComponent } from './site-general.component';

describe('SiteGeneralComponent', () => {
  let component: SiteGeneralComponent;
  let fixture: ComponentFixture<SiteGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
