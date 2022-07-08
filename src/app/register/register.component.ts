import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NG_ASYNC_VALIDATORS, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/user';
// import { getMaxListeners } from 'process';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();

  user: User;

  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  
  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {

    this.bsConfig = {
      containerClass: 'theme-red'
    }
    
    this.createRegisterForm();
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.passwordMatchValidator);
  }

  createRegisterForm(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required]],
      gender: ['male'],
      city: ['', Validators.required],
      country: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      knownAs: ['', Validators.required]

    },

      {validators: this.passwordMatchValidator}

    );
  }

  passwordMatchValidator(group: AbstractControl){ 
    return group.get('password').value === group.get('confirmPassword').value ? null: {'mismatch': true};
  }

  register(){

    if(this.registerForm.valid){
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success("Registration successful");
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user). 
        subscribe(() =>{
          this.router.navigate(['/member/edit']);
        });
      });
    }

  }
  
  cancel(){
    this.cancelRegister.emit(false);
  }
}