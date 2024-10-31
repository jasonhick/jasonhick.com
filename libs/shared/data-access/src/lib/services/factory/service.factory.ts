import { Injectable, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';

export function createService<T>(path: string): Type<BaseService<T>> {
  @Injectable({
    providedIn: 'root',
  })
  class GeneratedService extends BaseService<T> {
    constructor(http: HttpClient) {
      super(http);
      this.setPath(path);
    }
  }

  return GeneratedService;
}
