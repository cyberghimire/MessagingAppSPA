import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import {Injectable} from "@angular/core"
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { UserService } from "./user.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if(error instanceof HttpErrorResponse){
                    if(error.status===401){
                        return throwError(error.statusText);
                    }
                    const applicationError = error.headers.get('Application-Error');
                    if(applicationError){
                        return throwError(applicationError||"Server Error");
                    }
                }

                let serverError = error.error;
                let modelStateErrors = '';
                if(serverError.errors && typeof serverError.errors==='object'){
                    serverError = serverError.errors;
                    for(const key in serverError){
                        if(serverError[key]){
                            modelStateErrors+=serverError[key]+'\n';
                        }
                    }
                }
                else if(typeof serverError==='string'){
                    modelStateErrors=serverError;
                }
                return throwError(modelStateErrors|| serverError||"Server Error");
            })
        )
    }
}



export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS, 
    useClass: ErrorInterceptor,
    multi: true
}