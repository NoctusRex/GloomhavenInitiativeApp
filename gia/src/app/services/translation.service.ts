import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { toPairs } from 'lodash-es';

export enum Languages {
  ENGLISH = 'en',
  GERMAN = 'de',
}

@Injectable()
export class TranslationService {
  private currentLanguage: Languages;

  get language(): Languages {
    return this.currentLanguage;
  }

  set language(language: Languages) {
    this.currentLanguage = language;
    this.translate.use(language.toString());
  }

  constructor(private translate: TranslateService) {
    const langs = toPairs(Languages).map((x) => x[1]);
    const browserLang = translate.getBrowserLang();

    translate.addLangs(langs);
    translate.setDefaultLang(Languages.ENGLISH);
    translate.use(langs.includes(Languages[browserLang]) ? browserLang : 'en');
  }
}
