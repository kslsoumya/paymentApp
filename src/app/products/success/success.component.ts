import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  public userId;

  constructor(public _router :Router, public cookie :CookieService) { }

  ngOnInit() {

    this.userId =this.cookie.get('userId');
    setTimeout(()=>{
      this._router.navigate(['/products/'+this.userId])

    },5000)
    
  }

}
