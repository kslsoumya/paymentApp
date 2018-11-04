import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public password: String;
  public emailId: String;
  public mobile: Number;
  public firstName: String;
  public lastName: String;



  constructor(private httpService: HttpService , private toastr: ToastrService, private _router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }
  public createUser: any = () => {
    this.spinner.show();

    const newUser = {
      password: this.password,
      email: this.emailId,
      mobile: this.mobile,
      firstName: this.firstName,
      lastName: this.lastName
    };
    this.httpService.signUp(newUser).subscribe(
      (response) => {
        this.spinner.hide();
        // console.log(response);
        if (response['status'] === 200) {
        this.toastr.success('User Created successfully!!');
        setTimeout(() => {
          this._router.navigate(['/home']);
        });
        }  else {
        this.toastr.warning(response.message);
        }
    },
      (err) => {
        console.log(err.error);
        this._router.navigate(['/errorPage']);
      });
  }

}
