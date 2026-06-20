import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token') != null) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
      });
      return next.handle(clonedReq).pipe(
        filter((event: HttpEvent<any>) => (event instanceof HttpResponse || event instanceof HttpErrorResponse)),
        tap(
          succ => { },
          err => {
            if (err.status == 401) {
              localStorage.removeItem('token');
              this.router.navigateByUrl('/doris');
            }
            else if (err.status == 403)
              this.router.navigateByUrl('/main');
          }
        )
      )
    }
    else
      return next.handle(req.clone());
  }
}
