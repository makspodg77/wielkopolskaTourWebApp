import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Article } from './article.model';
import { Attraction } from './attraction.model';
import { Observable } from 'rxjs';
import { Comment } from './comment.model'
import { DOCUMENT } from '@angular/common';
import { use } from 'matter-js';
import { passwordChange } from './passwordChange.model';
import { Message } from './message.model';
import { User } from 'oidc-client';
import { UserModel } from './user.model';
import { Rank } from './Rank.model';
import { Role } from './role.model';
import { ExploreArticle } from './finalarticle.model';
@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor(private http: HttpClient) { }

  //readonly baseURL = "http://twojanaha-001-site1.gtempurl.com"
  readonly baseURL = "http://localhost:5196";
  getDepList(): Observable<ExploreArticle[]> {
    return this.http.get<ExploreArticle[]>(this.baseURL + '/api/Article');
  }

  getArtykul(id: any): Observable<any[]> {
    var url = this.baseURL + '/api/Article/' + id;
    return this.http.get<any>(url);
  }

  getArticlesAttractions(id: any): Observable<any[]> {
    var url = this.baseURL + '/api/Attraction/atrakcje/' + id;
    return this.http.get<any>(url);
  }

  getUserById(id: any): Observable<any[]> {
    var url = this.baseURL + '/api/Article/GetUser/' + id;
    return this.http.get<any>(url);
  }

  createAtrakcja(atrakcja: Attraction) {
    var url = this.baseURL + '/api/Attraction';
    return this.http.post<any>(url, atrakcja);
  }

  createArtykul(artykul: Article) {
    var url = this.baseURL + '/api/Article';
    return this.http.post<any>(url, artykul);
  }

  getAllAtrakcje(): Observable<any[]> {
    var url = this.baseURL + '/api/Attraction';
    return this.http.get<any>(url);
  }

  addAtrakcjArtykulu(artykulId: number, atrakcjaId: number) {
    var url = this.baseURL + '/api/ArticlesAttraction?artykulId=' + artykulId + '&atrakcjaId=' + atrakcjaId;
    return this.http.post<any>(url, artykulId);
  }

  removeAtrakcjeArtykulu(artykulId: number, atrakcjaId: number) {
    var url = this.baseURL + '/api/ArticlesAttraction?artykulId=' + artykulId + '&atrakcjaId=' + atrakcjaId;
    return this.http.delete<any>(url);
  }

  addLike(artykulId: any, artykul: Article) {
    var url = this.baseURL + '/api/Article/AddLike?artykulId=' + artykulId;
    return this.http.put<any>(url, artykul);
  }

  getArticlesImages(artykulId: number) {
    var url = this.baseURL + '/api/Image/artykul/' + artykulId;
    return this.http.get<any>(url);
  }

  getArticlesComments(artykulId: number) {
    var url = this.baseURL + '/api/Comment/article/' + artykulId;
    return this.http.get<any>(url);
  }

  deleteArticle(articleId: number): Observable<any> {
    var url = this.baseURL + '/api/Article/' + articleId;
    return this.http.delete<any>(url);
  }

  addComment(comment: Comment) {
    var url = this.baseURL + '/api/Comment';
    return this.http.post<any>(url, comment);
  }

  addCommentLike(comment: Comment) {
    var url = this.baseURL + '/api/Comment/AddLike/' + comment.id;
    return this.http.put<any>(url, comment);
  }

  getMostPopularAttractions() {
    var url = this.baseURL + '/api/Attraction/atrakcje';
    return this.http.get<any>(url);
  }

  getAtrakcjaById(attractionId: any) {
    var url = this.baseURL + '/api/Attraction/' + attractionId;
    return this.http.get<any>(url);
  }

  getNumberOfComments(articleId: any) {
    var url = this.baseURL + '/api/Comment/Artykul/' + articleId;
    return this.http.get<any>(url);
  }

  getArticlesFirstImage(articleId: any) {
    var url = this.baseURL + '/api/Image/artykul/first/' + articleId;
    return this.http.get<any>(url);
  }

  addLikeToTable(articleId: number, userId: string) {
    var url = this.baseURL + '/api/Like?articleId=' + articleId + '&userId=' + userId;
    return this.http.post<any>(url, articleId);
  }

  getArticlesLikes(articleId: number) {
    var url = this.baseURL + '/api/Like/article/' + articleId;
    return this.http.get<any>(url);
  }

  login(formData: any) {
    var url = this.baseURL + '/api/User/Login';
    return this.http.post<any>(url, formData);
  }
  register(user: any) {
    var url = this.baseURL + '/api/User/Register';
    return this.http.post<any>(url, user);
  }

  getalko() {
    var url = this.baseURL + '/api/UserProfile';
    return this.http.get(url);
  }

  getUserId() {
    var url = this.baseURL + '/api/UserProfile/userId';
    return this.http.get(url);
  }

  search(ex: string): Observable<ExploreArticle[]> {
    var url = this.baseURL + '/api/Article/search/' + ex;
    return this.http.get<ExploreArticle[]>(url);
  }

  search2(ex: string): Observable<ExploreArticle[]> {
    var url = this.baseURL + '/api/Article/search2/' + ex;
    return this.http.get<ExploreArticle[]>(url);
  }

  getNewestAricle(): Observable<any> {
    var url = this.baseURL + '/api/Article/NewestArticle';
    return this.http.get<any>(url);
  }

  addImage(image: any): Observable<any> {
    var url = this.baseURL + '/api/Image';
    return this.http.post<any>(url, image);
  }

  deleteImage(id: number): Observable<any> {
    var url = this.baseURL + '/api/Image/delete/' + id;
    return this.http.delete<any>(url);
  }

  updateArticle(article: any): Observable<any> {
    var url = this.baseURL + '/api/Article/' + article.Id;
    return this.http.put<any>(url, article);
  }

  getUserData(): Observable<any> {
    var url = this.baseURL + '/api/UserProfile/userData';
    return this.http.get<any>(url);
  }

  changePassword(passwordChange: passwordChange): Observable<any> {
    var url = this.baseURL + '/api/User/Reset';
    return this.http.post<any>(url, passwordChange);
  }

  postMessage(message: Message): Observable<boolean> {
    var url = this.baseURL + '/api/Message';
    return this.http.post<boolean>(url, message);
  }

  getMessages(): Observable<Message[]> {
    var url = this.baseURL + '/api/Message';
    return this.http.get<Message[]>(url);
  }

  deleteMessage(message: Message): Observable<boolean> {
    var url = this.baseURL + '/api/Message/' + message.id;
    return this.http.delete<boolean>(url);
  }

  getUsers(): Observable<UserModel[]> {
    var url = this.baseURL + '/api/User';
    return this.http.get<UserModel[]>(url);
  }

  getRanks(): Observable<Rank[]> {
    var url = this.baseURL + '/api/User/Ranks';
    return this.http.get<Rank[]>(url);
  }

  putUserRole(updatedRole: Role): Observable<boolean> {
    var url = this.baseURL + '/api/User/Ranks';
    return this.http.put<boolean>(url, updatedRole);
  }

  deleteUser(userId: string): Observable<boolean> {
    var url = this.baseURL + '/api/User/' + userId;
    return this.http.delete<boolean>(url);
  }

  numberOfArticlesByUser(userId: string): Observable<number> {
    var url = this.baseURL + '/api/User/NumberOfArticlesByUser/' + userId;
    return this.http.get<number>(url);
  }

  numberOfCommentsByUser(userId: string): Observable<number> {
    var url = this.baseURL + '/api/User/NumberOfCommentsByUser/' + userId;
    return this.http.get<number>(url);
  }

  numberOfLikedArticlesByUser(userId: string): Observable<number> {
    var url = this.baseURL + '/api/User/NumberOfLikedArticlesByUser/' + userId;
    return this.http.get<number>(url);
  }

  uploadImage(formData: FormData) {
    var url = this.baseURL + '/api/Upload';
    return this.http.post(url, formData, { reportProgress: true, observe: 'events' })
      
  }

  makeImageUrl(path: string): string {
    var newPath = path.substring(0);
    return this.baseURL + '/' + newPath;
  }

  getImage(imageId: number): Observable<any> {
    var url = this.baseURL + '/api/Image/' + imageId;
    return this.http.get<any>(url);
  }

  likeExists(articleId: number, userId: string): Observable<boolean> {
    var url = this.baseURL + '/api/Like/article?articleId=' + articleId + '&userId=' + userId;
    return this.http.get<boolean>(url);
  }

  roleMatch(allowedRoles: any[]): boolean {
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token')!.split('.')[1]));
    var userRole = payLoad.role;
    allowedRoles.forEach(function (element) {
            if (userRole == element) {
                isMatch = true;
            }
        });
    return isMatch;
  }

}
