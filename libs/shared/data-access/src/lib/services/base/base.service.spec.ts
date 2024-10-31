import { TestBed } from '@angular/core/testing';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

// Create a mock interface for testing
interface TestModel {
  id: number;
  name: string;
}

// Create a concrete service for testing
@Injectable()
class TestService extends BaseService<TestModel> {
  constructor(http: HttpClient) {
    super(http);
    this.setPath('test');
  }
}

describe('BaseService', () => {
  let service: TestService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5000/api/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockItem: TestModel = {
    id: 1,
    name: 'Test Item',
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list()', () => {
    it('should return an array of items', () => {
      const mockItems: TestModel[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];

      service.list().subscribe((items) => {
        expect(items).toEqual(mockItems);
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });
  });

  describe('get()', () => {
    it('should return a single item by id', () => {
      service.get(1).subscribe((item) => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItem);
    });
  });

  describe('post()', () => {
    it('should create a new item', () => {
      service.post(mockItem).subscribe((item) => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockItem);
      req.flush(mockItem);
    });
  });

  describe('put()', () => {
    it('should update an existing item', () => {
      service.put(1, mockItem).subscribe((item) => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockItem);
      req.flush(mockItem);
    });
  });

  describe('delete()', () => {
    it('should delete an item', () => {
      service.delete(1).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
