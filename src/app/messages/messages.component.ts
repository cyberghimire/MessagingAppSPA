import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Messages } from '../_models/messages';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Messages[];
  pagination: Pagination ;
  messageContainer = "Unread";

  constructor(private userService: UserService, private authService: AuthService, private route: ActivatedRoute,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {           //the "data" is coming from MessagesResolver
      this.messages = data['messages'].result;      
      this.pagination = data['messages'].pagination;
    })
  }
  
  loadMessages(messageContainer: string){
    this.messageContainer = messageContainer;
    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage,  this.messageContainer)
      .subscribe((response: PaginatedResult<Messages[]>) => {
          this.messages = response.result;
          this.pagination = response.pagination;

      }, error => {
        this.alertify.error(error);
      })
  }

  pageChanged(event: any): void{
    this.pagination.currentPage = event.page;
    this.loadMessages(this.messageContainer);
  }

  deleteMessage(id: number){
    this.alertify.confirm("Are you sure you want to delete this message?", () => {
      debugger;
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).
      subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id == id), 1);
        debugger;
        this.alertify.success("Message deleted.");
      }, error => {
        this.alertify.error("Failed to delete the message.");
      })
    });

  }

}
