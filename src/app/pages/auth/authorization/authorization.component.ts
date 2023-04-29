import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {IUsers} from "../../../models/users";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})

export class AuthorizationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() inputProp = 'test';
  @Input() inputObj: any;

  psw: string;
  login: string;
  loginText = 'Login';
  pswText = 'Password';
  selectedValue: boolean;
  cardNumber: string;
  authbutton: string

  constructor(private authService: AuthService,
              private messageService: MessageService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.authbutton = "Authorization";
    console.log('init')
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes)
  }

  ngOnDestroy() {
    console.log('destroy')
  }

  vipStatusSelect(): void {
    if (this.selectedValue) {}
  }

  onAuth(ev: Event): void{
    const authUser: IUsers = {
      psw: this.psw,
      login: this.login,
      cardNumber: this.cardNumber
    }
   if (this.authService.checkUser(authUser)) {
     this.userService.setUser(authUser);

     this.userService.setToken('user private token')

     this.router.navigate(['tickets/tickets-list']);

   } else {
     this.messageService.add({severity:'warn', summary:'Invalid username or password'});

   }
      }

}
