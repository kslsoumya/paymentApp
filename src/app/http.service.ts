import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // public baseUrl = 'http://localhost:4500';
  public baseUrl ='http://api.slicepay.themeanstackpro.com';

  constructor(public _http: HttpClient, public cookieService: CookieService) { }

  public signUp(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password);
    return (this._http.post(`${this.baseUrl}/api/v1/users/signup`, params));
  }

  public signIn(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return (this._http.post(`${this.baseUrl}/api/v1/users/login`, params));
  }


  public pwdService = (data) => {
    return this._http.put(`${this.baseUrl}/api/v1/users/forgotPwd`, data);
  }

  public getProducts =() =>{
    return this._http.get(`${this.baseUrl}/api/v1/products/get/all?authToken=${this.cookieService.get('authToken')}`);
  }

  public verifyUpi =(id) =>{
    const obj ={
      authToken :this.cookieService.get('authToken'),
      id :id
    }

    return this._http.post(`${this.baseUrl}/api/v1/users/verify_upi`,obj);
  }

  public verifyCard =(obj) =>{
    return this._http.post(`${this.baseUrl}/api/v1/users/verify_card?authToken=${this.cookieService.get('authToken')}`,obj);
  }

  public verifyBank =(obj) =>{
    return this._http.post(`${this.baseUrl}/api/v1/users/verify_bank?authToken=${this.cookieService.get('authToken')}`,obj);
  }

  public sendOtp = (obj) =>{
    obj.authToken = this.cookieService.get('authToken');
    return this._http.post(`${this.baseUrl}/api/v1/users/Send_Otp`,obj);
  }

  public verifyOtp = (obj) =>{
    obj.authToken = this.cookieService.get('authToken');
    return this._http.post(`${this.baseUrl}/api/v1/users/Verify_Otp`,obj);
  }

  public logOutFunction(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authToken'));
    return (this._http.post(`${this.baseUrl}/api/v1/users/logout`, params));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    } // end condition *if
    console.error(errorMessage);
    return Observable.throw(errorMessage);

  }
}
