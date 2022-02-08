import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  loader: Boolean;

  constructor(private userService: UserService) { 
    this.userService.loader.subscribe(res => {
      this.loader = res;
    })
  }

  ngOnInit() {

  }

}
