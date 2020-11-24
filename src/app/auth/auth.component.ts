import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  onSwitchMode(): void{
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm): void{
    if (!form.valid){
      return;
    }
    const email = form.value.email;
    const pass = form.value.password;
    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;
    if (this.isLoginMode){
      authObs = this.authService.login(email, pass);

    }
    else{
      authObs = this.authService.signUp(email, pass);
    }
    // so that we dont repeat ourselves
    authObs.subscribe(
      resData => {
        console.log('Response data');
        console.log(resData);
        this.error = null;
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      }, errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    form.reset();
  }

  onHandleError(): void {
    this.error = null;
  }
}
