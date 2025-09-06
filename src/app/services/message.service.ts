import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL, API_ENDPOINTS, API_HEADERS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  // Send message to backend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage(sessionId: string, message: string): Observable<any> {
    return this.http.post(`${BASE_URL}${API_ENDPOINTS.SEND_MESSAGE}`, 
      { sessionId, message },
      { headers: API_HEADERS }
    );
  }

  // Get all messages for a session
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMessagesBySession(sessionId: string): Observable<any[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any[]>(
      `${BASE_URL}${API_ENDPOINTS.GET_MESSAGES_BY_SESSION(sessionId)}`, 
      { headers: API_HEADERS }
    );
  }
}
