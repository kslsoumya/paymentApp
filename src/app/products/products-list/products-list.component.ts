import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { ActionSequence } from 'protractor';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  // Offers Data------

  public offers = [
    {
      product: 'Mi HDR 75 inch LED TV',
      Price: '12900 INR',
      quantity: 7,
      img: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/MI-TV0218656.jpg',
      offer: 20
    },
    {
      product: 'Sony PS4 Pro 1TB',
      Price: '36490 INR',
      quantity: 5,
      img: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/playstation-4-pro-vertical3aedbdf.png',
      offer: 30
    },
    {
      product: 'OnePlus 6T 256 GB',
      Price: '42000 INR',
      quantity: 10,
      img: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/OnePlus-6T0af478b.jpg',
      offer: 10
    },
    {
      product: 'Pioneer 7.1 channel home theatre',
      Price: '9862 INR',
      quantity: 4,
      img: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/Pioneer-7.1-DVD-Home-Theatere38e34c.jpg',
      offer: 15
    },
    {
      product: 'Alienware 17 Gaming laptop',
      Price: '224000 INR',
      quantity: 5,
      img: 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/dell_alienware17580535c.jpg',
      offer: 35
    }

  ];
  public products = [];
  public pagedProducts = [];
  public cartItems = [];
  public cartLength = 0;
  public userId;
  public cartAmount;


  constructor(private httpService: HttpService, private _router: Router, public route: ActivatedRoute,
    public cookie: CookieService, public toastr: ToastrService) { }


  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.httpService.getProducts().subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.products = response['data'];
          this.pagedProducts = this.products.splice(0, 4);
        } else {
          this.toastr.warning(response['message']);
          if (response['message'] === 'Invalid Or Expired Authentication Key') {
            this._router.navigate(['/home']);
          }
        }
      },
      (err) => {
        console.log(err);
        this._router.navigate(['/error']);
      })
  }

  // Funtion to add products to cart ----

  public addToCart = (product) => {
    this.cartItems.push(product);
    this.cartLength = this.cartItems.length;
    this.toastr.success('Product added to cart');
  }

  // Function to go to Payments Page -----

  public goToCart = () => {
    this.cartAmount = 0;
    this.cartItems.map((item) => {
      this.cartAmount += item['price/unit(INR)'];
    })
    this.cookie.set('cartAmount', this.cartAmount);
    this._router.navigate(['/payments/' + this.userId])
  }

  // Function for Infinite Scroll -----

  public onScroll = () => {
    // console.log('scrolled+------');
    const length = this.pagedProducts.length;
    this.pagedProducts = this.pagedProducts.concat(this.products.splice(length, 4));
    // console.log( this.pagedProducts);
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
