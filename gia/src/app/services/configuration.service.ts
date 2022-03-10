import { Inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { prototype } from 'events';
import { APP_BASE_HREF } from '@angular/common';
import { ProtractorExpectedConditions } from 'protractor';

@Injectable()
export abstract class ConfigurationService<T> {
  private _configuration: T;

  get configuration(): T {
    return cloneDeep(this._configuration);
  }

  constructor(
    protected httpClient: HttpClient,
    @Inject(APP_BASE_HREF) protected baseHref: string
  ) {}

  load(configuration: string): void {
    this.httpClient
      .get(`${this.baseHref}assets/configurations/${configuration}.config.json`)
      .subscribe((json) => {
        this._configuration = json as T;
      });
  }
}
