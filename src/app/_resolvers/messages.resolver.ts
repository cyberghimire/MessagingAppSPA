import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import {Observable, EMPTY, empty, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";
import {Messages} from "../_models/messages";
import { AuthService } from "../_services/auth.service";
import { EmitterVisitorContext } from "@angular/compiler";

@Injectable()
export class MessagesResolver implements Resolve<PaginatedResult<Messages[]>>{
    pageNumber = 1;
    pageSize = 5;
    messageContainer: string;
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService,
        private authService: AuthService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaginatedResult<Messages[]>> {
        
        return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer).pipe(
                    catchError( error => {
                        this.alertify.error("Problem retrieving messages.");
                        this.router.navigate(['/home']);
                        return EMPTY;
                    })
                );
    }

}