import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DatabaseService } from '../shared/database.service'
import { Comment } from '../shared/comment.model';
import { Observable, Subscriber } from 'rxjs';
import { userData } from '../shared/userData.model';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Image } from '../shared/image.model';
import $ from 'jquery';
import * as bootstrap from 'bootstrap';



@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private service: DatabaseService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }

  MAX_TITLE_LENGTH: number = 100;
  MAX_CONTENT_LENGTH: number = 2500;
  MAX_IMAGE_NUMBER: number = 10;
  MAX_ATTRACTION_NUMBER: number = 30;

  newComment: Comment = new Comment();
  Article: any = [];
  ArticlesAttractions: any = [];
  WszystkieAtrakcje: any = [];
  AllComments: any = [];
  AllUsableComments: any = [];
  ActualList: any = [];
  AuthorsName: any;
  Author: any;
  canOpen: boolean = false;
  mapLink: any = null;
  commentUser: any;
  Pictures: any = [];
  likesNumber: any;
  NotActiveAttractionsList: any = [];
  EditAttractions: any = [];
  ArticlesId: any;
  UserId: any;
  fileInput!: HTMLInputElement;
  Username: any;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ArticlesId = params['id'];
      this.getArticle(this.ArticlesId);
      this.getArticlesAttraction(this.ArticlesId);
      this.getImages();
      this.getAllAtrakcja();
      this.getUserId();
      this.fileInput = document.getElementById("file") as HTMLInputElement;
    });
  }

  deleteArticle() {
    this.service.deleteArticle(this.ArticlesId).subscribe();
  }

  doris: File[] = [];
  async coochie(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files !== null && target.files?.length != 0) {
      let file = target.files[0];
      var image = {};
      
      const reader = new FileReader();
      reader.onload = (e) => {
        image = { 'id': 0, 'name': file.name, 'file': file, 'funnyshowoff': e.target!.result, 'articleId': this.ArticlesId };
        this.Pictures.push(image);
        if (this.Pictures.length >= 10) 
          this.fileInput.disabled = true;
        
      }
      reader.readAsDataURL(file);
 
    }
  }
  userRole: string = "";
  async getUserId() {
    this.service.getUserData().subscribe((data: userData) => {
      this.userRole = data.role
      this.service.getUserId().subscribe(data => {
        this.UserId = data;
        if (this.UserId.id != this.Article.userId && this.userRole != 'Admin') {
          this.router.navigateByUrl("/app/main");
          this.canOpen = false;
        }
        else
          this.canOpen = true;
      });
    }
    );
  }
  originalPictures: any[] = [];
  getImages() {
    this.service.getArticlesImages(this.ArticlesId).subscribe(data => {
      data.forEach((d: Image) => {
        d.imageCode = this.service.makeImageUrl(d.imageCode);
      })
      this.Pictures = data;
      for (let i = 0; i < data.length; i++)
        this.originalPictures.push(data[i])
    });

  }

  async removeImage(name: any) {
    for (let i = 0; i < this.Pictures.length; i++) {
      if (name == this.Pictures[i].name) {
        const carouselElement = document.querySelector('.carousel');
        if (carouselElement) {
          const carousel = new bootstrap.Carousel(carouselElement);
          carousel.to(0);
        }
        this.Pictures.splice(i, 1);
        this.fileInput.disabled = false;
        break;
      }
    }
  }

  async removeImageFromDB(array: number[]) {
    array.forEach(id => {
      this.service.deleteImage(id).subscribe();
    });
  }

  picturesToDelete: any = [];
  picturesToPost: File[] = [];
  async updateImage() {
    for (let i = 0; i < this.Pictures.length; i++) {
      var flag: boolean = true;
      for (let j = 0; j < this.originalPictures.length; j++) {
        if (this.Pictures[i].name == this.originalPictures[j].name)
          flag = false;
      }
      if (flag) 
        this.picturesToPost.push(this.Pictures[i].file as File);
    }

    for (let i = 0; i < this.originalPictures.length; i++) {
      var flag: boolean = true;
      for (let j = 0; j < this.Pictures.length; j++) {
        if (this.Pictures[j].name == this.originalPictures[i].name)
          flag = false;
      }
      if (flag) {
        this.picturesToDelete.push(this.originalPictures[i].id);
        console.log(this.picturesToDelete);
      }
    }
    if (this.picturesToDelete.length > 0) 
      this.removeImageFromDB(this.picturesToDelete);
    
    if (this.picturesToPost.length > 0)
      this.uploadFile(this.picturesToPost);
    
  }

  public async getArticle(id: number) {
    this.Article = await new Promise<any>(resolve => {
      this.service.getArtykul(id).subscribe(resolve);
    });
    if (!(this.Article.mapLink.length == 0)) {
      this.mapLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.Article.mapLink);
      (document.getElementById("mapInput") as HTMLInputElement).value = this.Article.mapLink;
    }
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

  showAtrakcjeMenu() {
    var div = document.getElementById("category-container");
    div!.style.display = "block";
    if (document.getElementById("categories")?.childElementCount == 0) {
      this.AddAllOptions();
    }
  }

  async updateArticleInDB(article: any) {
    var output = await new Promise<any>(resolve => {
      this.service.updateArticle(article).subscribe(resolve);
    })
  }

  async updateArticle() {
    if (!this.validate())
      return;

    var obj = document.getElementById('ta1') as HTMLTextAreaElement;
    var obj2 = document.getElementById('ta2') as HTMLTextAreaElement;
    var article = { 'Id': this.ArticlesId, 'Title': obj.value, 'Content': obj2.value, 'Date': this.Article.date, 'MapLink': (document.getElementById("mapInput") as HTMLInputElement).value, 'UserId': this.Article.userId, 'lastUpdate': new Date()};

    this.updateArticleInDB(article);

    this.updateImage();

    this.UpdateAttractions();
  }

  onSearchChange(searchValue: Event): void {
    const target = searchValue.target as HTMLInputElement;
    if (target.value == "") 
      this.mapLink = null;
    else
      this.mapLink = this.sanitizer.bypassSecurityTrustResourceUrl(target.value);
  }

  AddAllOptions() {
    var flag = false;
    for (let i = 0; i < this.WszystkieAtrakcje.length; i++) {
      for (let j = 0; j < this.ArticlesAttractions.length; j++) {
        if (this.WszystkieAtrakcje[i].id == this.ArticlesAttractions[j].id) {
          this.ActualList.push(this.WszystkieAtrakcje[i]);
          flag = true;
          break;
        }
      }
      if (!flag) {
        this.NotActiveAttractionsList.push(this.WszystkieAtrakcje[i]);
      }
      flag = false;
    }
  }
  response: Event | undefined;
  progress!: number;
  message!: string;

  validate(): boolean {
    var titleError: HTMLElement = document.getElementById("titleError") as HTMLElement;
    var contentError: HTMLElement = document.getElementById("contentError") as HTMLElement;
    var mapError: HTMLElement = document.getElementById("mapError") as HTMLElement;
    var attractionError: HTMLElement = document.getElementById("attractionError") as HTMLElement;

    var titleInput: HTMLInputElement = document.getElementById("ta1") as HTMLInputElement;
    var contentInput: HTMLTextAreaElement = document.getElementById("ta2") as HTMLTextAreaElement;

    var returnFlag: boolean = true;

    if (titleInput.value.length < 10) {
      console.log(titleInput.value.length)
      titleError.classList.add("error");
      titleError.innerHTML = "Tytuł musi się składać z przynajmniej 10 znaków";
      returnFlag = false;
    }
    else {
      titleError.classList.remove("error");
      titleError.innerHTML = "";

      if (titleInput.value.length > this.MAX_TITLE_LENGTH) {
        titleError.classList.add("error");
        titleError.innerHTML = "Tytuł jest za długi";
        returnFlag = false;
      }
      else {
        titleError.classList.remove("error");
        titleError.innerHTML = "";
      }
    }

    if (contentInput.value.length > this.MAX_CONTENT_LENGTH) {
      contentError.classList.add("error");
      contentError.innerHTML = "Tytuł jest za długi";
      returnFlag = false;
    }
    else {
      contentError.classList.remove("error");
      contentError.innerHTML = "";

      if (contentInput.value.length < 40) {
        contentError.classList.add("error");
        contentError.innerHTML = "Zawartość artykułu musi składać się z przynajmniej 40 znaków";
        returnFlag = false;
      }
      else {
        contentError.classList.remove("error");
        contentError.innerHTML = "";
      }
    }


    if (this.EditAttractions.length == 0) {
      attractionError.classList.add("error");
      attractionError.innerHTML = "Artykuł musi posiadać przynajmniej jedną atrakcję";
      returnFlag = false;
    }
    else {
      attractionError.classList.remove("error");
      attractionError.innerHTML = "";

      if (this.EditAttractions.length > this.MAX_ATTRACTION_NUMBER) {
        attractionError.classList.add("error");
        attractionError.innerHTML = "Artykuł może posiadać maksymalnie 30 atrakcji";
        returnFlag = false;
      } else {
        attractionError.classList.remove("error");
        attractionError.innerHTML = "";
      }
    }

    return returnFlag;
  }

  public onUploadFinished = (arr: string[]) => {
    this.response = event;
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      var doris2 = new Image;
      doris2.imageCode = arr[i];
      doris2.name = this.picturesToPost[i].name;
      doris2.articleId = this.ArticlesId;
      console.log(doris2);
      this.service.addImage(doris2).subscribe();
    }
  }

  uploadFile = (files: File[]) => {
    if (files == null) {
      return;
    }

    let filesToUpload: File[] = files;

    const formData = new FormData();
    console.log(files)
    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file' + index, file, file.name);
    });

    this.service.uploadImage(formData).subscribe(
      {
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(100 * event.loaded / event.total!);
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';

            this.onUploadFinished(event.body as string[]);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }

  ClickService(id: any) {
    var flag = false;
    this.EditAttractions.forEach((element: any) => {
      if (id == element.id) {
        document.getElementById(id)!.style.backgroundColor = "red";
        this.EditAttractions.splice(this.EditAttractions.indexOf(element), 1);
        flag = true;
      }
    });
    if (!flag) {
      document.getElementById(id)!.style.backgroundColor = "green";
      this.WszystkieAtrakcje.forEach((element: any) => {
        if (id == element.id) {
          this.EditAttractions.push(element);
        }
      });
    }
  }

  countCharacters(id: string, maximum: number, counter: string) {
    var obj = document.getElementById(id) as HTMLTextAreaElement;
    var obj2 = document.getElementById(counter) as HTMLElement;

    obj2.innerHTML = obj.value.length + "/" + maximum;
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
          this.service.addAtrakcjArtykulu(this.ArticlesId, elementN.id).subscribe();
          flag = false;
        }
      });
      if (flag) 
        this.service.removeAtrakcjeArtykulu(this.ArticlesId, elementN.id).subscribe();
    });
  }

  CloseMenu() {
    var div = document.getElementById("category-container");
    div!.style.display = "none";
  }
}
