import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL, API_ENDPOINTS, API_HEADERS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search(query: string, sessionId: string): Observable<any[]> {
    let params = new HttpParams();
    if (query?.trim()) params = params.set('query', query.trim());
    if (sessionId?.trim()) params = params.set('sessionId', sessionId.trim());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any[]>(`${BASE_URL}${API_ENDPOINTS.SEARCH_MESSAGES}`, {
      headers: API_HEADERS,
      params
    });
  }
}
