import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPwdComponent implements OnInit {

  public email: String;
  public isSent = false;
  public message = 'Password Changed Successfully !!';
  public pwd: String;
  public hide = true;
  
  constructor(private httpService: HttpService, private toastr: ToastrService, private _router: Router,
    private spinner :NgxSpinnerService
    ) { }

  ngOnInit() {
  }

  // Function ForgotPassword----

  public forgotPwd = () => {
    this.spinner.show();
    const data = {
      email : this.email,
      password : this.pwd
    };
    this.httpService.pwdService(data).subscribe(
      (resp) => {
        this.spinner.hide();
        if (resp['status'] === 200) {
          this.isSent = true;
          this._router.navigate(['/home']);
        } else {
          this.toastr.warning(resp['message']);
        }
      },
      (err) => {
        this._router.navigate(['/errorPage']);
        console.log(err.error);
      });
  }

}
