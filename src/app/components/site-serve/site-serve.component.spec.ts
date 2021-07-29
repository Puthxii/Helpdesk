import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteServeComponent } from './site-serve.component';

describe('SiteServeComponent', () => {
  let component: SiteServeComponent;
  let fixture: ComponentFixture<SiteServeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteServeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteServeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
