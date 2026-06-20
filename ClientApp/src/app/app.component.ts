import { Component, OnInit } from '@angular/core';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { DatabaseService } from './shared/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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


export class AppComponent implements OnInit {
  constructor(private service: DatabaseService, private router: Router) { }
  User!: any;
  
  UserName: any | undefined;
  ngOnInit() {
    if (localStorage.getItem('token') != null) {
      this.piwo();
    }
    else {
      this.User = {
        fullName: "doris",
        nickName: "doris"
      };
    }
  }
  isOpen = false;
  isOpen2 = false;
  async piwo() {
    this.User = await new Promise<any>((resolve: any) => {
      this.service.getalko().subscribe(resolve);
    });
    console.log(this.User);

  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/entrance/login']).then(() => {
      window.location.reload();
    });
  }
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleUserMenu() {
    this.isOpen2 = !this.isOpen2;
  }
  title = 'projekt';

}
