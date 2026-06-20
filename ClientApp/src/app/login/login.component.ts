import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service'
import { Injectable } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private toastr: ToastrService, private fb: FormBuilder, private http:HttpClient, private service: DatabaseService, private router: Router) { }

  formModel = {
    UserName: '',
    Password: ''
    }

  ngOnInit(): void {
  }
  registration() {
    this.router.navigateByUrl('/registration');
  }

  onSubmit(form: NgForm) {
    this.service.login(form.value).subscribe((res: any) => {
      localStorage.setItem('token', res.token);
      this.router.navigateByUrl('/app/main').then(() => {
        this.toastr.success("Zalogowano pomyślnie!", "Sukces");
        

      });
    }, err => {
      this.toastr.error("Wpisz login i hasło jeszcze raz.", "Błąd logowania")
      console.log(err)
});
  }
}
