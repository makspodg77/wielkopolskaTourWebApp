import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private toastr: ToastrService, private fb: FormBuilder, private http: HttpClient, private service: DatabaseService, private router: Router) { }

  formModel = this.fb.group({
    UserName: [''],
    FullName: [''],
    Passwords: this.fb.group({
      Password: [''],
      ConfirmPassword: ['']
    })
  });
  ngOnInit(): void {
  }
  onSubmit() {
    this.register();
  }
  register() {
    var body = {
      Login: this.formModel.value.UserName,
      Password: this.formModel.value.Passwords?.Password,
      FullName: this.formModel.value.FullName
    };
    return this.service.register(body).subscribe(x => { this.router.navigateByUrl('login').then(() => { this.toastr.success("Rejestracja powiodła się!", "Sukces"); }); },
      err => {
        this.toastr.error("Rejestracja nie powiodła się.", "Błąd rejestracji");
        console.log(err)
});
  }
}
