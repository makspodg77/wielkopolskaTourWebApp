import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../shared/database.service';
import { Message } from '../shared/message.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private service: DatabaseService, private router: Router) { }

  TITLE_MAX_LENGTH: number = 200;
  CONTENT_MAX_LENGTH: number = 2000;
  EMAIL_MAX_LENGTH: number = 200;

  expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  mapFlag: boolean = false;
  titleInput!: HTMLInputElement;
  contentInput!: HTMLInputElement;
  emailInput!: HTMLInputElement;

  ngOnInit(): void {
    this.titleInput = document.getElementById("titleInput") as HTMLInputElement;
    this.contentInput = document.getElementById("contentInput") as HTMLInputElement;
    this.emailInput = document.getElementById("emailInput") as HTMLInputElement;
  }

  postMessage() {
    if (this.validate()) {
      var message: Message = new Message;
      message.title = this.titleInput.value;
      message.content = this.contentInput.value;
      message.email = this.emailInput.value;

      this.service.getUserId().subscribe(data => {
        message.userId = (data as any).id;
        this.service.postMessage(message).subscribe(data => window.location.reload());
      });
    }
  }

  validate(): boolean {
    if (this.titleInput.value.length > this.TITLE_MAX_LENGTH) {
      document.getElementById("titleValidationError")!.innerHTML = "* Tytuł wiadomości jest za długi";
      return false;
    }
    else
      document.getElementById("titleValidationError")!.innerHTML = "";

    if (this.contentInput.value.length > this.CONTENT_MAX_LENGTH) {
      document.getElementById("contentValidationError")!.innerHTML = "* Wiadomość jest za długa";
      return false;
    }
    else
      document.getElementById("contentValidationError")!.innerHTML = "";

    if (this.emailInput.value.length > this.EMAIL_MAX_LENGTH) {
      document.getElementById("emailValidationError")!.innerHTML = "* Email jest za długi";
      return false;
    }
    else
      document.getElementById("emailValidationError")!.innerHTML = "";

    if (!this.expression.test(this.emailInput.value)) {
      document.getElementById("emailValidationError")!.innerHTML = "* Nieprawidłowy email";
      return false;
    }
    else
      document.getElementById("emailValidationError")!.innerHTML = "";

    return true;
  }

  clearInputs() {
    this.titleInput.value = "";
    this.contentInput.value = "";
    this.emailInput.value = "";
  }
}
