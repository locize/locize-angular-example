import { APP_INITIALIZER, NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { I18NEXT_SERVICE, I18NextModule, I18NextLoadResult, ITranslationService, defaultInterpolationFormat  } from 'angular-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import LocizeApi from 'i18next-locize-backend';
import LastUsed from 'locize-lastused';
import { locizePlugin } from 'locize';

import { AppComponent } from './app.component';

const locizeOptions = {
  projectId: 'c0fa7b2a-219b-44c8-8672-e386b8123b21',
  // apiKey: 'my-api-key' // used for handleMissing functionality, do not add your api-key in a production build
};

const i18nextOptions = {
  debug: true,
  fallbackLng: 'en',
  // saveMissing: true, // do not use the saveMissing functionality in production: https://docs.locize.com/guides-tips-and-tricks/going-production
  backend: locizeOptions,
  locizeLastUsed: locizeOptions,
  interpolation: {
    format: I18NextModule.interpolationFormat(defaultInterpolationFormat)
  }
};

export function appInit(i18next: ITranslationService) {
  return () => {
    let promise: Promise<I18NextLoadResult> = i18next
      // locize-lastused
      // sets a timestamp of last access on every translation segment on locize
      // -> safely remove the ones not being touched for weeks/months
      // https://github.com/locize/locize-lastused
      // do not use the lastused functionality in production: https://docs.locize.com/guides-tips-and-tricks/going-production
      .use(LastUsed)
      // locize-editor
      // InContext Editor of locize
      .use(locizePlugin)
      // i18next-locize-backend
      // loads translations from your project, saves new keys to it (saveMissing: true)
      // https://github.com/locize/i18next-locize-backend
      .use(LocizeApi)
      .use<any>(LanguageDetector)
      .init(i18nextOptions);
    return promise;
  };
}

export function localeIdFactory(i18next: ITranslationService)  {
  return i18next.language;
}

export const I18N_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: appInit,
    deps: [I18NEXT_SERVICE],
    multi: true
  },
  {
    provide: LOCALE_ID,
    deps: [I18NEXT_SERVICE],
    useFactory: localeIdFactory
  },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    I18NextModule.forRoot()
  ],
  providers: [
    I18N_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
