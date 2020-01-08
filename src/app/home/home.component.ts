import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Promotion } from '../shared/promotion';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dishErrMess: string;
  dish: Dish;
  promoErrMess: string;
  leaderErrMess: string;
  promotion: Promotion;
  leader: Leader;

  baseURL = 'http://localhost:4331/assets/';
  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    // @Inject('BaseURL') private baseURL
  ) { }

  ngOnInit() {
    this.dishService.getFeatureDish()
    .subscribe(
      dish => this.dish = dish,
      errmess => this.dishErrMess = <any>errmess);
    // .then(dish => this.dish = dish);

    this.promotionService.getFeaturedPromotion()
    .subscribe(
      promotion => this.promotion = promotion,
      errmess => this.promoErrMess = <any>errmess
      );
    // .then(promotion => this.promotion = promotion);

    this.leaderService.getFeaturedLeader()
    .subscribe(
      leader => this.leader = leader,
      errmess => this.leaderErrMess = <any>errmess
      );
    // .then(leader => this.leader = leader);
  }

}
