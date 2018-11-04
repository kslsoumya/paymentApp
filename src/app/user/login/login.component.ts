import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public hide = true;
  public emailId;
  public password;

  constructor(private httpService: HttpService, private toastr: ToastrService, private _router: Router,
    private cookie: CookieService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  // Login Function----

  public loginUser = () => {
    this.spinner.show();
    const userData = {
      email: this.emailId,
      password: this.password
    };
    this.httpService.signIn(userData).subscribe(
      (resp) => {
        this.spinner.hide();
        console.log(resp);
        if (resp.status === 200) {
          this.toastr.success(resp.message);
          this.cookie.set('authToken', resp.data.authToken);
          this.cookie.set('userId', resp.data.userDetails.userId);
          this.cookie.set('userName', resp.data.userDetails.firstName + resp.data.userDetails.lastName);
          this._router.navigate(['/products/' + resp.data.userDetails.userId]);
        } else {
          this.toastr.warning(resp.message);
        }
      },
      (err) => {
        this._router.navigate(['/errorPage']);
        console.log(err.error);
      });

  }

}
