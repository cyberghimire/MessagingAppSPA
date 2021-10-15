import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {


  constructor() { }

  confirm(message: string, okCallback: ()=> any ): any {
      alertify.confirm(message, function (event: any) {
        if(event){
          okCallback();
        }
        else {}
      });
  }

  success(message: string){
    alertify.success(message);
  }

  error(message: string){
    alertify.error(message);
  }

  warning(message: string){
    alertify.warning(message);
  }

  message(message: string){
    alertify.success(message);
  }
}