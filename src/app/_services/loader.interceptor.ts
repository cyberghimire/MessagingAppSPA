import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { UserService } from "./user.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor{
    constructor(private userService: UserService){
        
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                this.userService.loader.next(true);
                if(event.type == HttpEventType.Response){
                        this.userService.loader.next(false);
                    
                }
            })
        )
    }
}