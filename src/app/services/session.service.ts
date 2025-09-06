import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL, API_ENDPOINTS, API_HEADERS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class SessionService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSessions(): Observable<any[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any[]>(`${BASE_URL}${API_ENDPOINTS.GET_SESSIONS}`, { headers: new HttpHeaders(API_HEADERS) });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSessionName(sessionId: string, sessionName: string): Observable<any> {
    return this.http.patch(
      `${BASE_URL}${API_ENDPOINTS.UPDATE_SESSION_NAME(sessionId)}`,
      { sessionName },
      { headers: new HttpHeaders(API_HEADERS) }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleFavorite(sessionId: string): Observable<any> {
    return this.http.post(`${BASE_URL}${API_ENDPOINTS.TOGGLE_FAVORITE(sessionId)}`, {}, { headers: new HttpHeaders(API_HEADERS) });
  }
}
