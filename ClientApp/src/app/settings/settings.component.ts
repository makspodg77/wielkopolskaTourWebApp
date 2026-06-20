import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import { passwordChange } from '../shared/passwordChange.model';
import { userData } from '../shared/userData.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private service: DatabaseService) { }
  isVisiblePasswordChangeWindow: boolean = false;
  isVisibleLoginChangeWindow: boolean = false;
  isVisibleNicknameChangeWindow: boolean = false;

  passwordChange: passwordChange = new passwordChange;
  userData: userData = new userData;
  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.service.getUserData().subscribe(data => {
      this.userData = data;
    });
  }

  passwordChangeWindowService() {
    if (this.isVisiblePasswordChangeWindow)
      document.getElementById("passwordchangecontainer")!.style.display = "none";
    else
      document.getElementById("passwordchangecontainer")!.style.display = "block";

    this.isVisiblePasswordChangeWindow = !this.isVisiblePasswordChangeWindow;
  }

  loginChangeWindowService() {
    if (this.isVisibleLoginChangeWindow)
      document.getElementById("loginchangecontainer")!.style.display = "none";
    else
      document.getElementById("loginchangecontainer")!.style.display = "block";

    this.isVisibleLoginChangeWindow = !this.isVisibleLoginChangeWindow;
  }

  nicknameChangeWindowService() {
    if (this.isVisibleNicknameChangeWindow)
      document.getElementById("nicknamechangecontainer")!.style.display = "none";
    else
      document.getElementById("nicknamechangecontainer")!.style.display = "block";

    this.isVisibleNicknameChangeWindow = !this.isVisibleNicknameChangeWindow;
  }

  changePassword() {
    var actualPassword: string = (document.getElementById("actualPasswordInput") as HTMLInputElement).value;
    var newPassword: string = (document.getElementById("newPasswordInput") as HTMLInputElement).value;
    var rePassword: string = (document.getElementById("rePasswordInput") as HTMLInputElement).value;

    this.passwordChange.id = this.userData.id;
    this.passwordChange.oldPassword = actualPassword;
    this.passwordChange.newPassword = newPassword;
    this.passwordChange.rePassword = rePassword;

    if (newPassword == rePassword) {
      this.service.changePassword(this.passwordChange).subscribe();
    }
  }

}
