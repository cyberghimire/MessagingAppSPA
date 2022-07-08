import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {map} from "rxjs/operators"
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl + "auth/";
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User | any;
  photoUrlBehaviorSubject = new BehaviorSubject<string>("../../assets/bade.jpg.jpg");
  currentPhotoUrl = this.photoUrlBehaviorSubject.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string){
    this.photoUrlBehaviorSubject.next(photoUrl);
  }

login(model: any){
  return this.http.post(this.baseUrl + 'login', model).pipe(
    map((response: any) => {
      const user = response;
      if(user){
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user.user))
        this.decodedToken = this.jwtHelper.decodeToken(user.token);
        this.currentUser = user.user;
        this.changeMemberPhoto(this.currentUser.photoUrl);
        console.log(this.decodedToken);
      }
    })
  )
}

loggedIn(){
  const token: any=localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);   //returns true if the token is NOT expired
}

register(user: User){
  return this.http.post(this.baseUrl+ 'register', user);
}
}
