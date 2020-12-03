import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  userForm: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService) {
    auth.getCurrentLoggedIn();
  }
  ngOnInit() {
    this.buildForm();
  }
  buildForm(): void {
    this.userForm = new FormGroup({
      emailSignup: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      passwordSignup: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ])
    });
  }

  get emailSignup() {
    return this.userForm.get('emailSignup');
  }

  get passwordSignup() {
    return this.userForm.get('passwordSignup');
  }

  signup(): void {
    this.auth.emailSignUp(this.userForm.value.emailSignup, this.userForm.value.passwordSignup)
  }

  googleLogin(): void {
    this.auth.googleLogin();
  }
}