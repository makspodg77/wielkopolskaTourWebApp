import { Component, OnInit } from '@angular/core';
import { User } from 'oidc-client';
import { Article } from '../shared/article.model';
import { DatabaseService } from '../shared/database.service';
import { Message } from '../shared/message.model';
import { Rank } from '../shared/Rank.model';
import { Role } from '../shared/role.model';
import { UserModel } from '../shared/user.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private service: DatabaseService) { }

  articles: Article[] = [];
  messages: Message[] = [];
  users: UserModel[] = [];
  roles: Rank[] = [];

  messageWindow!: HTMLElement;

  ngOnInit(): void {
    this.getArticles();
    this.getMessages();
    this.getUsers();
    this.getRoles();
    this.messageWindow = document.getElementById("message") as HTMLElement;
  }

  valueChanges(event: Event, user: UserModel) {
    var selectChanged = event.target as HTMLSelectElement;
    var updateRole: Role = new Role;
    updateRole.roleId = Number(selectChanged.value);
    updateRole.userId = user.id;
    this.service.putUserRole(updateRole).subscribe();
  }

  deleteUser(userId: string) {
    this.service.deleteUser(userId).subscribe();
  }

  getRoles() {
    this.service.getRanks().subscribe(data => this.roles = data);
  }

  getUsers() {
    this.service.getUsers().subscribe(data => this.users = data);
  }

  getArticles() {
    this.service.getDepList().subscribe(data => this.articles = data);
  }

  getMessages() {
    this.service.getMessages().subscribe(data => this.messages = data);
  }


  displayMessage(message: Message) {
    document.querySelector(".messageheader")!.innerHTML = message.title;
    document.querySelector(".messageemail")!.innerHTML = message.email;
    document.querySelector(".messagecontent")!.innerHTML = message.content;

    var func = this.service;
    document.getElementById("deleteBtn")!.addEventListener('click', function handleClick(event) {
      func.deleteMessage(message).subscribe(data => { });
    });

    this.messageWindow.style.display = "block";
  }

  closeMessage() {
    this.messageWindow.style.display = "none";
  }
}
