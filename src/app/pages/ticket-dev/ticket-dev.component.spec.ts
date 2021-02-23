/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketDevComponent } from './ticket-dev.component';

describe('TicketDevComponent', () => {
  let component: TicketDevComponent;
  let fixture: ComponentFixture<TicketDevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
