import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import {Observable, EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";

@Injectable()
export class MemberListResolver implements Resolve<PaginatedResult<User[] | null | undefined> | undefined>{
    pageNumber = 1;
    pageSize = 20;
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaginatedResult<User[] | null | undefined> | undefined> {
        
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
                    catchError( error => {
                        this.alertify.error("Problem retrieving data");
                        this.router.navigate(['/home']);
                        return EMPTY;
                    })
                );
    }

}