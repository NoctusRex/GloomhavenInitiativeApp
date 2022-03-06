import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../models/group.model';
import { Initiative } from '../models/initiative.model';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class InitiativesConfigurationService extends ConfigurationService<
  Array<Group<Group<Group<Initiative>>>>
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'initiatives');
  }
}
