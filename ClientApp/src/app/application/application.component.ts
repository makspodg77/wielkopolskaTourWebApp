import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'oidc-client';
import { ExploreComponent } from 'src/app/explore/explore.component';
import { EventEmitterService } from '../event-emitter.service';
import { DatabaseService } from '../shared/database.service';
import { userData } from '../shared/userData.model';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
  animations: [
    trigger('menuToggle', [
      state('open', style({ transform: 'translateX(0)' })),
      state('close', style({ transform: 'translateX(-150%)' })),
      transition('open <=> close', [
        animate('200ms 100ms ease-out')
      ]),
    ]),
    trigger('menuUserToggle', [
      state('open', style({ transform: 'translateX(0)' })),
      state('close', style({ transform: 'translateX(150%)' })),
      transition('open <=> close', [
        animate('200ms 100ms ease-out')
      ]),
    ])
  ],
})
export class ApplicationComponent implements OnInit {

  constructor(private service: DatabaseService, private router: Router, private eventEmitterService: EventEmitterService) { }
  User!: any;
  userRole: string = "";
  ngOnInit() {
    this.service.getUserData().subscribe((data: userData) => this.userRole = data.role);
    var navbar = document.getElementById("doris") as HTMLElement;
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 0) {
        navbar.classList.add("active");
      } else {
        navbar.classList.remove("active");
      }
    });
    this.User = {
      fullName: "NaN",
      nickName: "NaN"
    };
    if (localStorage.getItem('token') != null) {
      this.getUsersName();
    }
  }
  ex: string | undefined;
  isOpen = false;

  isOpen2 = false;

  getUsersName() {
      this.service.getalko().subscribe(data => this.User = data);
  }
  routeToExplore() {
    this.router.navigate(['/app/explore'], { queryParams: { 'page-size': 8, 'filter': 5 } });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleUserMenu() {
    this.isOpen2 = !this.isOpen2;
  }
  closeUserMenu() {
    this.isOpen2 = false;
  }

  searchUrl() {
    if (this.ex?.length != 0) {
      this.router.navigate(
        ['/app/explore'],
        { queryParams: { 'word': this.ex, 'page-size': 8, 'filter': 5 } }
      );
    }
    else {
      this.router.navigate(
        ['/app/explore'],
        { queryParams: { 'page-size': 8 } }
      );
    }
  }
}
