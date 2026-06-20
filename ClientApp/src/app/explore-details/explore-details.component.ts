import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { async } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { DatabaseService } from '../shared/database.service'
import { Comment } from '../shared/comment.model';

@Component({
  selector: 'app-explore-details',
  templateUrl: './explore-details.component.html',
  styleUrls: ['./explore-details.component.css']
})
export class ExploreDetailsComponent implements OnInit {
  
  constructor(private service: DatabaseService, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  newComment: Comment = new Comment();
  Article: any = [];
  ArticlesAttractions: any = [];
  WszystkieAtrakcje: any = [];
  AllComments: any = [];
  AllUsableComments: any = [];
  ActualList: any = [];
  AuthorsName: any;
  Author: any;
  mapLink: any;
  commentUser: any;
  Pictures: any = [];
  PicturesSrc: any = [];
  likesNumber: any;
  FirstPicture: any;
  NotActiveAttractionsList: any = [];
  EditAttractions: any = [];
  ArticlesId: any;
  UserId: any;
  isMap: boolean = false;
  Username: any;
  canLike: boolean = false;
  numberOfLikedArticlesByUser: number = 0;
  numberOfCommentsByUser: number = 0;
  numberOfArticlesByUser: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe(params => this.ArticlesId = params['id']);
    this.getArticle(this.ArticlesId);
    this.getArticlesAttraction(this.ArticlesId);
    this.getImages();
    this.getComments(this.ArticlesId);
    this.getAllAtrakcja();
    this.getUserId();
  }
  
  async getUserId() {
    this.UserId = await new Promise<any>(resolve => {
      this.service.getUserId().subscribe(resolve);
    });
    this.service.likeExists(this.ArticlesId, this.UserId.id).subscribe(data => {
      this.canLike = data;
    });
  }

  async getComments(artykulId: any) {
    this.AllComments = await new Promise<object[]>(resolve => {
      this.service.getArticlesComments(artykulId).subscribe(resolve);
    });
    for (let i = 0; i < this.AllComments.length; i++) {
      this.commentUser = await new Promise<object>(resolve => {
        this.service.getUserById(this.AllComments[i].userId).subscribe(resolve);
      });
      this.AllUsableComments.push({ ...this.commentUser, ...this.AllComments[i] });
    }
  }

  async addComment() {
    var id = await new Promise<any>(resolve => {
      this.service.getUserId().subscribe(resolve);
    });
    this.newComment.userId = id.id;
    this.newComment.articleId = this.ArticlesId;
    this.service.addComment(this.newComment).subscribe(data => { });
    this.RefreshPage();
  }

  async getImages() {
    this.Pictures = await new Promise<object[]>(resolve => {
      this.service.getArticlesImages(this.ArticlesId).subscribe(resolve);
    })
    for (let i = 0; i < this.Pictures.length; i++) {
      this.PicturesSrc.push(this.service.makeImageUrl(this.Pictures[i].imageCode));
    }
    this.FirstPicture = this.PicturesSrc[0];
    this.PicturesSrc.splice(0, 1);
  }

  public async getArticle(id: number) {
    this.Article = await new Promise<any>(resolve => {
      this.service.getArtykul(id).subscribe(resolve);
    });

    this.service.numberOfArticlesByUser(this.Article.userId).subscribe(data => {
      this.numberOfArticlesByUser = data;
    });

    this.service.numberOfCommentsByUser(this.Article.userId).subscribe(data => {
      this.numberOfCommentsByUser = data;
    });

    this.service.numberOfLikedArticlesByUser(this.Article.userId).subscribe(data => {
      this.numberOfLikedArticlesByUser = data;
    });

    if (!(this.Article.mapLink == null || this.Article.mapLink.length == 0))
      this.mapLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.Article.mapLink);
    else
      this.mapLink = null;

    this.likesNumber = await new Promise<number>(resolve => {
      this.service.getArticlesLikes(this.ArticlesId).subscribe(resolve)
    });
    this.Author = await new Promise<any>(resolve => {
      this.service.getUserById(this.Article.userId).subscribe(resolve)
    });
    this.AuthorsName = this.Author.fullName;
  }

  getAllAtrakcja() {
    this.service.getAllAtrakcje().subscribe(data => {
      this.WszystkieAtrakcje = data;
    })
  }

  getArticlesAttraction(id: number) {
    this.service.getArticlesAttractions(id).subscribe(data => {
      this.ArticlesAttractions = data;
      this.ArticlesAttractions.forEach((val: any) => this.EditAttractions.push(Object.assign({}, val)));
    })
  }

  async AddLike() {
    var id = await new Promise<any>(resolve => {
      this.service.getUserId().subscribe(resolve);
    });

    this.service.addLikeToTable(this.ArticlesId, id.id).subscribe(data => { });
    this.RefreshPage();
  }

  AddCommentLike(commentId: number) {
    for (let i = 0; i < this.AllComments.length; i++) {
      if (this.AllComments[i].id == commentId) {
        this.service.addCommentLike(this.AllComments[i]).subscribe(data => { });
        this.RefreshPage();
      }
    }
  }
  RefreshPage() {
    setTimeout(() => {
      window.location.reload();
    }, 300)
  }

  UpdateAttractions() {
    this.WszystkieAtrakcje.forEach((elementN: any) => {
      var flag: boolean = true;
      this.EditAttractions.forEach((elementT: any) => {
        if (elementT.id == elementN.id) {
          this.service.addAtrakcjArtykulu(this.ArticlesId, elementN.id).subscribe(data => { });
          flag = false;
        }
      });
      if (flag) {
        this.service.removeAtrakcjeArtykulu(this.ArticlesId, elementN.id).subscribe(data => { });
      }
    });
    this.RefreshPage();
  }

  CloseMenu() {
    var div = document.getElementById("category-container");
    div!.style.display = "none";
  }
}
