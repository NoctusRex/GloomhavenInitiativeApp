import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { HttpClient } from '@angular/common/http';

@Injectable()
export abstract class ConfigurationService<T> {
  private _configuration: T;

  get configuration(): T {
    return cloneDeep(this._configuration);
  }

  constructor(httpClient: HttpClient, configuration: string) {
    httpClient
      .get(`assets/configurations/${configuration}.config.json`)
      .subscribe((json) => {
        this._configuration = json as T;
      });
  }
}
