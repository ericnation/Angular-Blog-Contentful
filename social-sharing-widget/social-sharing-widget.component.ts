import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

// 'Add To any' exception
declare var a2a_config: any;
declare var a2a: any;

@Component({
  selector: 'social-sharing-widget',
  templateUrl: './social-sharing-widget.component.html',
  styleUrls: ['./social-sharing-widget.component.scss']
})

export class SocialSharingWidgetComponent implements OnInit, AfterViewInit {
  @Input() articleSlug: string;
  @Input() articleTitle: string;
  articleUrl: string;
  window: any;

  constructor() {
  }

  ngOnInit() {
    this.window = window;
    this.articleUrl = window.location.protocol + '//' + window.location.host + '/article/' + this.articleSlug;
  }

  initializeA2A() {
      this.window.a2a_config = a2a_config || {};
      this.window.a2a_config.color_main = 'D7E5ED';
      this.window.a2a_config.color_border = 'AECADB';
      this.window.a2a_config.color_link_text = '333333';
      this.window.a2a_config.color_link_text_hover = '333333';
      if (this.window.a2a) {
        this.window.a2a.init('page');
      }
  }

  ngAfterViewInit() {
    this.initializeA2A();
  }


}
