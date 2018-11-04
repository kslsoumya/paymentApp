import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  public hide = true;

  public basicOptions = [{ title: 'Domestic', checked: true },
  { title: 'International', checked: false }];

  public checkboxValues = [{ title: 'Visa', checked: true },
  { title: 'Master', checked: false }, { title: 'Amex', checked: false }];

  public payOptions = [{ title: 'Credit Card', checked: true },
  { title: 'Debit Card', checked: false }, { title: 'Net Banking', checked: false },
  { title: 'UPI', checked: false }];

  // public creditCardForm : FormGroup
  public cardType = 'Visa';
  public name;
  public cardNumber;
  public expiryDate;
  public cvv;
  public amount;
  public paymentMode;
  public isCard = true;
  public isBank = false;;
  public isUpi = false;;
  public isValueChanged = false;
  public cardModel = 'Domestic';
  public userId;
  public upiId;
  public bank;
  public userName;
  public bankPwd;
  public isPayment = false;
  public isOtpPage = false;
  public mobileNo;
  public isOtpVerification = false;
  public otpSent;

  constructor(public cookie: CookieService, public toastr: ToastrService, public httpService: HttpService,
    private _router: Router, private spinner: NgxSpinnerService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.amount = this.cookie.get('cartAmount');
    this.userId = this.cookie.get('userId');
    if (this.amount > 0) {
      this.isPayment = true;
    } else {
      this.isPayment = false;
      setTimeout(() => {
        this._router.navigate(['/products/' + this.userId])
      }, 3000)
    }

  }

  // Function to update cardModel ----

  public updateBasicOptions = (selected) => {
    this.cardModel = selected;
    this.basicOptions.forEach(value => {
      if (value.title === selected) {
        value.checked = true
      } else {
        value.checked = false;
      }
    })
  }

  // Function to select payment option ----

  public selectPaymentOption = (selected) => {
    this.paymentMode = selected;
    this.payOptions.forEach(value => {
      if (value.title === selected) {
        value.checked = true;
        if (value.title === 'Credit Card' || value.title === 'Debit Card') {
          this.isCard = true;
          this.isBank = false;
          this.isUpi = false;
        } else if (value.title === 'Net Banking') {
          this.isBank = true;
          this.isUpi = false;
          this.isCard = false;
        } else {
          this.isUpi = true;
          this.isBank = false;
          this.isCard = false;
        }
      } else {
        value.checked = false;
      }
    })
  }

  // function to update card type selection -----

  public updateSelection = (selected) => {
    this.cardType = selected;
    this.checkboxValues.forEach(value => {
      if (value.title === selected) {
        value.checked = true
      } else {
        value.checked = false;
      }
    })
  }


  // Luhns Algorithm----

  public valid_credit_card(value) {
    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) return false;

    // The Luhn Algorithm. It's so pretty.
    var nCheck = 0, nDigit = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n),
        nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return (nCheck % 10) == 0;
  }

  // Function to send OTP ----

  public submitMobileNo = () => {
    this.spinner.show();
    const obj = {
      mobile: 91 + this.mobileNo
    }
    this.httpService.sendOtp(obj).subscribe(
      (resp) => {
        this.spinner.hide();
        if (resp['status'] === 200) {
          this.isOtpVerification = true;
        } else {
          this.toastr.warning(resp['message']);
        }
      },
      (err) => {
        this._router.navigate(['/errorPage'])
      }

    )
  }

  // Function to verify OTP ------

  public verifyOtp = () => {
    this.spinner.show();
    const obj = {
      otp: this.otpSent,
      mobile: 91 + this.mobileNo
    }
    this.httpService.verifyOtp(obj).subscribe(
      (resp) => {
        this.spinner.hide();
        if (resp['status'] === 200) {
          this._router.navigate(['/successPage']);
        } else {
          this.toastr.warning(resp['message']);
        }
      },
      (err) => {
        this._router.navigate(['/errorPage'])
      })
  }


  // Function to validate payment ---

  public payAmount = () => {
    this.spinner.show();
    if (this.isCard) {
      if (this.valid_credit_card(this.cardNumber)) {
        if (this.cvv && this.expiryDate && this.name) {
          const obj = {
            cardModel: this.cardModel,
            cardType: this.cardType,
            cardNo: this.cardNumber,
            cardCvv: this.cvv,
            cardExpiry: this.expiryDate
          }

          this.httpService.verifyCard(obj).subscribe(
            (resp) => {
              this.spinner.hide();
              if (resp['status'] === 200) {
                this.spinner.hide();
                this.isOtpPage = true;
                //  this._router.navigate(['/successPage']);
              } else {
                this.toastr.warning(resp['message']);
              }
            },
            (err) => {
              this._router.navigate(['/errorPage'])
            }

          )
        } else {
          this.spinner.hide();
          this.toastr.warning('Please Fill All Details')
        }
      } else {
        this.spinner.hide();
        this.toastr.warning('Card is Invalid.Try Again!!')
      }
    }

    else if (this.isUpi) {
      this.httpService.verifyUpi(this.upiId).subscribe(
        (resp) => {
          if (resp['status'] === 200) {
            this.spinner.hide();
            this.isOtpPage = true;
            // this._router.navigate(['/successPage']);

          } else {
            this.spinner.hide();
            this.toastr.warning(resp['message']);
          }
        },
        (err) => {
          this._router.navigate(['/errorPage'])
        }

      )
    } else {
      const bankDetails = {
        bank: this.bank,
        userName: this.userName,
        password: this.bankPwd
      }
      this.httpService.verifyBank(bankDetails).subscribe(
        (resp) => {
          if (resp['status'] === 200) {
            this.spinner.hide();
            // this._router.navigate(['/successPage']);
            this.isOtpPage = true;
          } else {
            this.spinner.hide();
            this.toastr.warning(resp['message']);
          }
        },
        (err) => {
          this._router.navigate(['/errorPage'])
        }

      )
    }



  }


    // Function to logout User

    public logOut: any = () => {
      this.httpService.logOutFunction()
        .subscribe(resp => {
          if (resp.status === 200) {
            this.cookie.deleteAll();
            this._router.navigate(['/']);
          } else {
            this.toastr.error(resp.message);
          }
        },
          (err) => {
            console.log(err);
            this._router.navigate(['/errorPage']);
          });
    }
    

}
