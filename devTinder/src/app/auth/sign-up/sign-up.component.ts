import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  confirmPassword:string | undefined;
  signup : SignUp = new SignUp();
  private url = 'http://localhost:3000/signUp';

  constructor(private http: HttpClient) {}

  onSignUp(): void {
    console.log('signup',this.signup);
    // this.http.post(this.url, this.signup).subscribe({
    //   next: (res: any) => {
    //     console.log('Login response:', res);
    //   },
    //   error: (err) => {
    //     console.error('Login failed:', err);
    //   }
    // });
  }

  reset(){
    this.signup= new SignUp();
    this.confirmPassword='';
  }
}

export class SignUp{
  firstName : String | undefined;
  lastName : String | undefined;
  email : String | undefined;
  password : String | undefined;
  age : String | undefined; 
}