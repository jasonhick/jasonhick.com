import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

interface Client {
  id?: number;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list()', () => {
    it('should return an array of clients', () => {
      const mockClients: Client[] = [
        {
          id: 1,
          name: 'Client 1',
          description: 'Description 1',
          website: 'http://client1.com',
        },
        {
          id: 2,
          name: 'Client 2',
          description: 'Description 2',
          website: 'http://client2.com',
        },
      ];

      service.list().subscribe((clients) => {
        expect(clients).toEqual(mockClients);
      });

      const req = httpMock.expectOne('/api/clients');
      expect(req.request.method).toBe('GET');
      req.flush(mockClients);
    });
  });

  describe('get()', () => {
    it('should return a single client by id', () => {
      const mockClient: Client = {
        id: 1,
        name: 'Test Client',
        description: 'Test Description',
        website: 'http://test.com',
      };

      service.get(1).subscribe((client) => {
        expect(client).toEqual(mockClient);
      });

      const req = httpMock.expectOne('/api/clients/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockClient);
    });
  });

  describe('post()', () => {
    it('should create a new client', () => {
      const mockClient: Client = {
        name: 'New Client',
        description: 'New Description',
        website: 'http://new.com',
      };

      service.post(mockClient).subscribe((client) => {
        expect(client).toEqual({ ...mockClient, id: 1 });
      });

      const req = httpMock.expectOne('/api/clients');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockClient);
      req.flush({ ...mockClient, id: 1 });
    });
  });

  describe('put()', () => {
    it('should update an existing client', () => {
      const mockClient: Client = {
        id: 1,
        name: 'Updated Client',
        description: 'Updated Description',
        website: 'http://updated.com',
      };

      service.put(1, mockClient).subscribe((client) => {
        expect(client).toEqual(mockClient);
      });

      const req = httpMock.expectOne('/api/clients/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockClient);
      req.flush(mockClient);
    });
  });

  describe('delete()', () => {
    it('should delete a client', () => {
      service.delete(1).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne('/api/clients/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
