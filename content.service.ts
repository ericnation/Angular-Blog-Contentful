import { Injectable } from '@angular/core';
import * as contentful from 'contentful';
import { LoDashStatic } from 'lodash';
declare const _: LoDashStatic;
import * as marked from'marked';
import { environment } from '../../../environments/environment';

marked.setOptions({
  renderer: new marked.Renderer(),
  sanitize: true,
  smartLists: true,
  smartypants: true
});

@Injectable()
export class ContentService {

  contentFul = environment.contentful;

  client: contentful.ContentfulClientApi;

  constructor() {
    this.client = contentful.createClient({
      // This is the space ID. A space is like a project folder in Contentful terms
      space: this.contentFul.SPACE_ID,
      // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
      accessToken: this.contentFul.ACCESS_TOKEN
    });
  }

  async getArticles() {
    return await this.fetchEntriesForContentType('blogPost');
  }

  async getArticle(slug) {
    return await this.fetchEntryForSlug('blogPost', slug);
  }

  // Load all entries for a given Content Type from Contentful
  fetchEntriesForContentType(contentType) {
    return this.client.getEntries({
      content_type: contentType
    })
      .then((response) => {
        let entries: any = response.items;
        _.forEach(entries, (item) => {
          item.fields.body = marked(item.fields.body);
        })
        return entries;
      })
      .catch((error) => {
        console.log(console.error(`\nError occurred while fetching Entries for ${contentType.name}:`))
        console.error(error)
      })
  }

  // Load all entries for a given Content Type from Contentful
  fetchEntryForSlug(contentType, slug) {
    return this.client.getEntries({
      content_type: contentType,
      'fields.slug[in]': slug,
    })
      .then((response) => {
        if (response.items.length == 1) {
          let entry: any = response.items[0];
          entry.fields.body = marked(entry.fields.body);
          return entry;
        }
        return null;
      })
      .catch((error) => {
        console.log(console.error(`\nError occurred while fetching Entries for ${contentType.name}:`));
        console.error(error);
      })
  }
}
