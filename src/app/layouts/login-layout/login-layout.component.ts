import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-layout',
  template: `
  <main>
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  </main>
  `,
  styles: [
    'main { padding-top: 67px; }'
  ]
})
export class LoginLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
