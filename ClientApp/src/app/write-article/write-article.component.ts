import { Component, OnInit } from '@angular/core';
import { Attraction } from '../shared/attraction.model';
import { DatabaseService } from '../shared/database.service'
import { Article } from '../shared/article.model';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Image } from '../shared/image.model';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import $ from 'jquery';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-write-article',
  templateUrl: './write-article.component.html',
  styleUrls: ['./write-article.component.css']
})


export class WriteArticleComponent implements OnInit {
  response: Event | undefined ;

  MAX_TITLE_LENGTH: number = 100;
  MAX_CONTENT_LENGTH: number = 2500;
  MAX_IMAGE_NUMBER: number = 10;
  MAX_ATTRACTION_NUMBER: number = 30;

  constructor(private service: DatabaseService, private router: Router, private http: HttpClient, private toastr: ToastrService, private sanitizer: DomSanitizer) { }
  atrakcja: Attraction = new Attraction();
  artykul: Article = new Article();
  image: Image = new Image();
  ngOnInit(): void {
    this.fileInput = document.getElementById("file") as HTMLInputElement;
  }
  images: any = [];
  fileName = '';
  file: any;
  mapLink: any = null;
  Article: any = [];
  ArticlesAttractions: any = [];
  WszystkieAtrakcje: any = [];
  AllComments: any = [];
  AllUsableComments: any = [];
  ActualList: any = [];
  AuthorsName: any;
  Author: any;
  commentUser: any;
  Pictures: any = [];
  PicturesSrc: any = [];
  likesNumber: any;
  FirstPicture: any;
  NotActiveAttractionsList: any = [];
  EditAttractions: any = [];
  ArticlesId: any;
  UserId: any;
  Username: any;
  fileInput!: HTMLInputElement;

  progress!: number;
  message!: string;
    public onUploadFinished = (arr: string[]) => {
      
    this.response = event;
        for (let i = 0; i < this.PicturesSrc.length; i++) {
            console.log(this.response);
            this.PicturesSrc[i].imageCode = arr[i];
      this.PicturesSrc[i].articleId = this.ArticlesId;
      this.service.addImage(this.PicturesSrc[i]).subscribe();
    } };
  uploadFile = (files: File[]) => {
    if (files.length === 0) {
      return;
    }
    let filesToUpload: File[] = files;
    const formData = new FormData();

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
              console.log(event.body);
            this.onUploadFinished(event.body as string[]);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }

  async addAtrakcja() {
    this.service.createAtrakcja(this.atrakcja).subscribe(res => {
      this.router.navigateByUrl("/app/main").then(() => {
        this.toastr.success("Atrakcja została dodana!", "Sukces");
      })
    }, err => {
      this.router.navigateByUrl("/app/main").then(() => {
        this.toastr.success("Atrakcja została dodana!", "Sukces");
      })
    });
  }

  async removeImage(id: any) {
    for (let i = 0; i < this.PicturesSrc.length; i++) {
      if (id == this.PicturesSrc[i].id) {
        const carouselElement = document.querySelector('.carousel');
        if (carouselElement) {
          const carousel = new bootstrap.Carousel(carouselElement);
          carousel.to(0);
        }
        this.PicturesSrc.splice(i, 1);
        this.fileInput.disabled = false;
        break;
      }
    }
  }
  showAtrakcjeMenu() {
    var div = document.getElementById("category-container");
    div!.style.display = "block";
    if (document.getElementById("categories")?.childElementCount == 0) {
      this.AddAllOptions();
    }
  }

  AddAllOptions() {
    this.service.getAllAtrakcje().subscribe(data => {
      this.WszystkieAtrakcje = data;
    })
  }

  RefreshPage() {
    setTimeout(() => {
      window.location.reload();
    }, 300)
  }

  CloseMenu() {
    var div = document.getElementById("category-container");
    div!.style.display = "none";
  }

  UpdateAttractions() {
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

  async addArticle() {
    if (!this.validate())
      return;
    
    var id: any;
    var articleId: any;
    this.service.getUserId().subscribe(data => {
      id = data;
      this.artykul.mapLink = (document.getElementById("mapInput") as HTMLInputElement).value;
      this.artykul.userId = id.id;
      this.service.createArtykul(this.artykul).subscribe(data => {
          articleId = data.id;
          this.ArticlesId = data.id;
        if (this.PicturesSrc.length != 0) {
          this.uploadFile(this.doris);
        }
        for (let i = 0; i < this.EditAttractions.length; i++) {
          this.service.addAtrakcjArtykulu(articleId, this.EditAttractions[i].id).subscribe();
          }
          this.toastr.success("Pomyślnie dodane artykuł.", "Sukces!");
      })
    });
  }
  countCharacters(id: string, maximum: number, counter: string) {
    var obj = document.getElementById(id) as HTMLTextAreaElement;
    var obj2 = document.getElementById(counter) as HTMLElement;

    obj2.innerHTML = obj.value.length + "/" + maximum;
  }

  onSearchChange(searchValue: Event): void {
    const target = searchValue.target as HTMLInputElement;
    if (target.value == "")
      this.mapLink = null;
    else
      this.mapLink = this.sanitizer.bypassSecurityTrustResourceUrl(target.value);
  }
  doris: File[] = [];
  async coochie(e: Event) {
    if (this.PicturesSrc.length >= 10)
      return;
    
    const target = e.target as HTMLInputElement;
    if (target.files !== null && target.files?.length != 0) {
      let file = target.files[0];
      this.doris.push(file);
      var image = {};
      const reader = new FileReader();
      reader.onload = (e) => {
        image = { 'id': 0, 'name': file.name, 'imageCode': '', 'articleId': this.ArticlesId };
        this.PicturesSrc.push(image);

        if (this.PicturesSrc.length >= 10)
          this.fileInput.disabled = true;

      }
      reader.readAsDataURL(file);
    }
  }
}
