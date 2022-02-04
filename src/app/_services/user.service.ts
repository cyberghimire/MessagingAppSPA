import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { empty, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/internal/operators/map';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

  getUsers(page?: number, itemsPerPage?: number): Observable<PaginatedResult<User[] | null | undefined> | undefined>{
    const paginatedResult: PaginatedResult<User[] | null | undefined> = new PaginatedResult<User[] | null | undefined>();
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
          console.log("Error retrieving data. ")
          return;
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

  setMainPhoto(userId: number, id: number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }
}
