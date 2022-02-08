import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Messages } from 'src/app/_models/messages';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId: number;

  messages: Messages[];
  newMessage: any = {};

  constructor(private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages(){
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(currentUserId, this.recipientId)
    .pipe(
      tap(messages => {
        for(let i = 0; i< messages.length; i++ ){
          if(messages[i].isRead === false && messages[i].recipientId === currentUserId)
          {
            this.userService.markAsRead(currentUserId, messages[i].id);

          }
        }
      })
    )
    .subscribe(messages => {
      this.messages = messages;
    }, 
    error => {
      this.alertify.error(error);
    })
  }

  sendMessage(){
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
    .subscribe((message: Messages | any) => {
        this.messages.push(message);
        this.newMessage.content = '';

    },
    error => {
      this.alertify.error(error);
    })
  }

  

}
