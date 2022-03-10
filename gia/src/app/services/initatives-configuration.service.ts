import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Group } from '../models/group.model';
import { Initiative } from '../models/initiative.model';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class InitiativesConfigurationService extends ConfigurationService<
  Array<Group<Group<Group<Initiative>>>>
> {
  constructor(
    httpClient: HttpClient,
    @Inject(APP_BASE_HREF) protected baseHref: string
  ) {
    super(httpClient, baseHref);
    this.load('initiatives');
  }
}
