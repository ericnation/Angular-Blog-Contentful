import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ContentService } from 'app/shared/services/content.service';

import { LoDashStatic } from 'lodash';
import { NgForm } from '@angular/forms';
import { GlobalHelpers } from '../../../shared/helpers';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
declare const _: LoDashStatic;

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, AfterContentInit {
  public _: LoDashStatic = _;
  emailRegEx: RegExp = GlobalHelpers.emailRegEx;
  serverError = null;
  formSubmitted: boolean = false;
  alerts: boolean = false;
  successText: string = '';
  subscribeEmail: string = '';

  blogArticles;
  subscriptionEmail: string = '';

  constructor(
    private contentService: ContentService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.contentService.getArticles().then(articles => {
      this.blogArticles = _.sortBy(articles, 'fields.publishDate').reverse();
    });
  }

  ngAfterContentInit() {
    $('.article-cards-wrap .article:nth-child(even)').appendTo(
      '.article-cards-wrap'
    );
  }

  onSubscribeSubmit(form: NgForm) {
    this.subscribeEmail = form.value.subscriptionEmailInput;
    form.value.subscriptionEmailInput = '';
    this.formSubmitted = true;
    console.log('form ', form.value.subscriptionEmailInput);
    this.http
      .post(`${environment.firebase.functionsEndpoint}/resource_subscribe/`, {
        emailAddress: this.subscribeEmail
      })
      .toPromise()
      .then((result: any) => {
        if (result.statusCode === 200) {
          this.alerts = true;
          this.successText = 'Success! You are now subscribed 😄';
          // Clear out alert panels after 4 seconds
          // TODO: We need to have Design flesh out a consistent error messaging components
          // An inline version and a Flash message version for different use cases.
          setTimeout(() => {
            this.alerts = false;
            this.successText = '';
          }, 4000);
        }
      })
      .catch((error: Response | any) => {
        this.alerts = true;
        // Clear out alert panels after 4 seconds
        // TODO: We need to have Design flesh out a consistent error messaging components
        // An inline version and a Flash message version for different use cases.
        this.serverError = error.message._body || 'Oops, something went wrong! Please contact us if the problem persist.';
        setTimeout(() => {
          this.alerts = false;
          this.serverError = null;
        }, 4000);
      });
  }
}
