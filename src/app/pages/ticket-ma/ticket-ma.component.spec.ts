/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketMaComponent } from './ticket-ma.component';

describe('TicketMaComponent', () => {
  let component: TicketMaComponent;
  let fixture: ComponentFixture<TicketMaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketMaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketMaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
