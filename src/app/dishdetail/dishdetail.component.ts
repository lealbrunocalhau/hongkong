import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from "../shared/comment";
import { visibility, flyInOut, expand } from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  visibility = 'show';

  @Input()
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  @ViewChild('cform') comentFormDirective;
  commentForm: FormGroup;
  comment: Comment;
  errMess: string;

  dishcopy: Dish;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Name must be at least 2 characters long.'
    }

  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private baseURL
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(
      dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess);

    this.route.params
      .pipe(switchMap((params: Params) => {
        this.visibility = 'hidden';
        return this.dishService.getDish(params['id']);
      }
      ))
      .subscribe(
        dish => {
          this.dish = dish;
          this.dishcopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = 'show';
        },
        errmess => this.errMess = <any>errmess);
    // const id = this.route.snapshot.params['id'];
    // this.dishService.getDish(id)
    // .subscribe(dish => this.dish = dish);
    // .then(dish => this.dish = dish);
  }


  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: [5, Validators.required],
      comment: ['', Validators.required],
      date: '',
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();

  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString()
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(
        dish => {
          this.dish = dish;
          this.dishcopy = dish;
        },
        errmess => {
          this.dish = null;
          this.dishcopy = null;
          this.errMess = <any>errmess;
        })

    this.comentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      rating: 5,
      comments: '',
      date: ''
    })
    ///antigo On Submit() estudar...
    // var dateComment = new Date();
    // var dataIsoString = dateComment.toISOString();
    // this.commentForm.value.date = dataIsoString;
    // this.dish.comments.push(this.commentForm.value)
    // this.comment = this.commentForm.value;
    // this.comentFormDirective.resetForm();
    // this.commentForm.reset({
    //   author: '',
    //   rating: 5,
    //   comments: '',
    //   date: ''
    // });
  }
}
