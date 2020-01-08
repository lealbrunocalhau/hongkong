import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'false',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  // selectedDish: Dish;
  errMess: string;
  baseURL = 'http://localhost:4331/assets/';
  constructor(
    private dishService: DishService,
    // @Inject('BaseURL') private baseURL
    ) { }

  ngOnInit() {
    this.dishService.getDishes()
    .subscribe(
      dishes => this.dishes = dishes,
      errmess => this.errMess = <any>errmess
      );
    // .then(dishes => this.dishes = dishes);
  }

  // onSelect(dish: Dish){
  //   this.selectedDish = dish;
  // }
}
