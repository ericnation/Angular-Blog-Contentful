import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'app/shared/services/content.service'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, AfterViewInit {

  article;

  constructor(private route: ActivatedRoute, private contentService: ContentService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      this.contentService.getArticle(params['slug']).then(article => {
        if (article) {
          this.article = article
        }
      })
    })
  }
}
