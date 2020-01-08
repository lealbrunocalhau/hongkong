import { Injectable, Inject } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService,
    @Inject('BaseURL') private baseURL
  ) { }

  submitFeedback(feedback: any): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedback', feedback, httpOptions)
            .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
