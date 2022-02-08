import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/internal/operators/map';
import { Messages } from '../_models/messages';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  loader = new BehaviorSubject<boolean>(false);

  getSpinnerObserver(): Observable<boolean>{
    return this.loader.asObservable();
  }


  constructor(private http: HttpClient) { }

  getUsers(page?: number, itemsPerPage?: number): Observable<PaginatedResult<User[]>>{
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if(page != null && itemsPerPage != null){
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params })
    .pipe(
      map(response => {
        paginatedResult.result = response.body; 
        if(response.headers.get('Pagination') != null){
          paginatedResult.pagination = JSON.parse(response.headers.get("Pagination") as string);
          return paginatedResult;
        }
        else{
          console.log("Error retrieving data.");
          return null;
        }
      })
    );
  }

  getUser(id: string| number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User){
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, photoId: number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setMain', {});
  }

  deletePhoto(userId: number, photoId: number){
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + photoId);
  }

  getMessages(userId: number, page?: number, itemsPerPage?: number, messageContainer?: string){
    const paginatedResult : PaginatedResult<Messages[]> = new PaginatedResult<Messages[] >();

    let params = new HttpParams();
    params = params.append('messageContainer', messageContainer);

    if(page !=null && itemsPerPage !=null){
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Messages[]>(this.baseUrl + 'users/' + userId + '/messages', {observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if(response.headers.get('Pagination') != null){
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') as string);
        }
        return paginatedResult;

      })
    );
  }

  getMessageThread(userId: number, recipientId: number){
    return this.http.get<Messages[]>(this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId);

  }

  sendMessage(userId: number, message: Messages){
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages', message );
  }

  deleteMessage(id: number, userId: number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, messageId: number){
    this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read' , {})
    .subscribe();
  }
}
