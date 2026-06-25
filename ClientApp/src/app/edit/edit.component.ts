import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DatabaseService } from '../shared/database.service';
import { Comment } from '../shared/comment.model';
import { userData } from '../shared/userData.model';
import { Image } from '../shared/image.model';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  readonly MAX_TITLE_LENGTH = 100;
  readonly MAX_CONTENT_LENGTH = 2500;
  readonly MAX_IMAGE_NUMBER = 10;
  readonly MAX_ATTRACTION_NUMBER = 30;

  newComment: Comment = new Comment();
  Article: any = [];
  ArticlesAttractions: any = [];
  WszystkieAtrakcje: any = [];
  EditAttractions: any = [];
  ActualList: any = [];
  NotActiveAttractionsList: any = [];
  Pictures: any = [];
  originalPictures: any[] = [];
  picturesToDelete: any[] = [];

  AuthorsName: any;
  Author: any;
  mapLink: any = null;
  likesNumber: any;
  ArticlesId: any;
  UserId: any;
  Username: any;
  userRole: string = '';
  canOpen: boolean = false;

  fileInput!: HTMLInputElement;

  constructor(
    private service: DatabaseService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      this.ArticlesId = params['id'];
      await this.getArticle(this.ArticlesId);
      this.getArticlesAttraction(this.ArticlesId);
      this.getImages();
      this.getAllAtrakcja();
      this.getUserId();
      this.fileInput = document.getElementById('file') as HTMLInputElement;
    });
  }

  // ─── Article ─────────────────────────────────────────────────────────────────

  async getArticle(id: number) {
    this.Article = await new Promise<any>(resolve => {
      this.service.getArtykul(id).subscribe(resolve);
    });

    if (this.Article.mapLink?.length > 0) {
      this.mapLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.Article.mapLink);
      (document.getElementById('mapInput') as HTMLInputElement).value = this.Article.mapLink;
    }

    this.likesNumber = await new Promise<number>(resolve => {
      this.service.getArticlesLikes(this.ArticlesId).subscribe(resolve);
    });

    this.Author = await new Promise<any>(resolve => {
      this.service.getUserById(this.Article.userId).subscribe(resolve);
    });

    this.AuthorsName = this.Author.fullName;
  }

  async updateArticle() {
    if (!this.validate()) return;

    const title = (document.getElementById('ta1') as HTMLTextAreaElement).value;
    const content = (document.getElementById('ta2') as HTMLTextAreaElement).value;
    const mapLink = (document.getElementById('mapInput') as HTMLInputElement).value;

    const article = {
      Id: this.ArticlesId,
      Title: title,
      Content: content,
      Date: this.Article.date,
      MapLink: mapLink,
      UserId: this.Article.userId,
      lastUpdate: new Date()
    };

    await this.updateArticleInDB(article);
    await this.updateImages();
    this.updateAttractions();
  }

  async updateArticleInDB(article: any) {
    await new Promise<any>(resolve => {
      this.service.updateArticle(article).subscribe(resolve);
    });
  }

  deleteArticle() {
    this.service.deleteArticle(this.ArticlesId).subscribe();
  }

  // ─── Images ──────────────────────────────────────────────────────────────────

  getImages() {
    this.service.getArticlesImages(this.ArticlesId).subscribe(data => {
      data.forEach((d: Image) => {
        d.imageCode = this.service.makeImageUrl(d.imageCode);
      });
      this.Pictures = data;
      this.originalPictures = [...data];
    });
  }

  async onFileSelected(e: Event) {
    if (this.Pictures.length >= this.MAX_IMAGE_NUMBER) return;

    const target = e.target as HTMLInputElement;
    if (!target.files?.length) return;

    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.Pictures.push({
        id: 0,
        name: file.name,
        imageCode: reader.result as string,
        articleId: this.ArticlesId
      });

      if (this.Pictures.length >= this.MAX_IMAGE_NUMBER)
        this.fileInput.disabled = true;
    };

    reader.readAsDataURL(file);
  }

  async removeImage(name: string) {
    const index = this.Pictures.findIndex((p: any) => p.name === name);
    if (index === -1) return;

    const carouselElement = document.querySelector('.carousel');
    if (carouselElement) new bootstrap.Carousel(carouselElement).to(0);

    this.Pictures.splice(index, 1);
    this.fileInput.disabled = false;
  }

  async updateImages() {
    const originalNames = new Set(this.originalPictures.map((p: any) => p.name));
    const currentNames = new Set(this.Pictures.map((p: any) => p.name));

    // New pictures to upload
    const toPost = this.Pictures.filter((p: any) => !originalNames.has(p.name));

    // Deleted pictures to remove from DB
    const toDelete = this.originalPictures
      .filter((p: any) => !currentNames.has(p.name))
      .map((p: any) => p.id);

    toDelete.forEach((id: number) => {
      this.service.deleteImage(id).subscribe();
    });

    toPost.forEach((pic: any) => {
      this.service.addImage(pic).subscribe({
        next: (res) => console.log('Image saved:', res),
        error: (err) => console.error('Image save failed:', err)
      });
    });
  }

  // ─── Attractions ─────────────────────────────────────────────────────────────

  getAllAtrakcja() {
    this.service.getAllAtrakcje().subscribe(data => {
      this.WszystkieAtrakcje = data;
    });
  }

  getArticlesAttraction(id: number) {
    this.service.getArticlesAttractions(id).subscribe(data => {
      this.ArticlesAttractions = data;
      this.EditAttractions = data.map((val: any) => ({ ...val }));
    });
  }

  showAtrakcjeMenu() {
    const div = document.getElementById('category-container');
    if (!div) return;
    div.style.display = 'block';
    if (document.getElementById('categories')?.childElementCount === 0) {
      this.addAllOptions();
    }
  }

  closeMenu() {
    const div = document.getElementById('category-container');
    if (div) div.style.display = 'none';
  }

  addAllOptions() {
    this.WszystkieAtrakcje.forEach((attraction: any) => {
      const isActive = this.ArticlesAttractions.some((a: any) => a.id === attraction.id);
      if (isActive) this.ActualList.push(attraction);
      else this.NotActiveAttractionsList.push(attraction);
    });
  }

  clickAttraction(id: any) {
    const existingIndex = this.EditAttractions.findIndex((e: any) => e.id === id);

    if (existingIndex !== -1) {
      document.getElementById(id)!.style.backgroundColor = 'red';
      this.EditAttractions.splice(existingIndex, 1);
    } else {
      document.getElementById(id)!.style.backgroundColor = 'green';
      const attraction = this.WszystkieAtrakcje.find((e: any) => e.id === id);
      if (attraction) this.EditAttractions.push(attraction);
    }
  }

  updateAttractions() {
    this.WszystkieAtrakcje.forEach((attraction: any) => {
      const isSelected = this.EditAttractions.some((e: any) => e.id === attraction.id);
      if (isSelected)
        this.service.addAtrakcjArtykulu(this.ArticlesId, attraction.id).subscribe();
      else
        this.service.removeAtrakcjeArtykulu(this.ArticlesId, attraction.id).subscribe();
    });
  }

  // ─── User ─────────────────────────────────────────────────────────────────────

  async getUserId() {
    this.service.getUserData().subscribe((data: userData) => {
      this.userRole = data.role;
      this.service.getUserId().subscribe(data => {
        this.UserId = data;
        if (this.UserId.id !== this.Article.userId && this.userRole !== 'Admin') {
          this.router.navigateByUrl('/app/main');
          this.canOpen = false;
        } else {
          this.canOpen = true;
        }
      });
    });
  }

  // ─── UI Helpers ──────────────────────────────────────────────────────────────

  onSearchChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.mapLink = value
      ? this.sanitizer.bypassSecurityTrustResourceUrl(value)
      : null;
  }

  countCharacters(id: string, maximum: number, counter: string) {
    const input = document.getElementById(id) as HTMLTextAreaElement;
    const display = document.getElementById(counter) as HTMLElement;
    display.innerHTML = `${input.value.length}/${maximum}`;
  }

  refreshPage() {
    setTimeout(() => window.location.reload(), 300);
  }

  // ─── Validation ──────────────────────────────────────────────────────────────

  validate(): boolean {
    const titleInput = document.getElementById('ta1') as HTMLInputElement;
    const contentInput = document.getElementById('ta2') as HTMLTextAreaElement;

    const titleError = document.getElementById('titleError') as HTMLElement;
    const contentError = document.getElementById('contentError') as HTMLElement;
    const attractionError = document.getElementById('attractionError') as HTMLElement;

    let valid = true;

    const setError = (el: HTMLElement, msg: string) => {
      el.classList.add('error');
      el.innerHTML = msg;
      valid = false;
    };

    const clearError = (el: HTMLElement) => {
      el.classList.remove('error');
      el.innerHTML = '';
    };

    // Title
    if (titleInput.value.length < 10)
      setError(titleError, 'Tytuł musi się składać z przynajmniej 10 znaków');
    else if (titleInput.value.length > this.MAX_TITLE_LENGTH)
      setError(titleError, 'Tytuł jest za długi');
    else
      clearError(titleError);

    // Content
    if (contentInput.value.length < 40)
      setError(contentError, 'Zawartość artykułu musi składać się z przynajmniej 40 znaków');
    else if (contentInput.value.length > this.MAX_CONTENT_LENGTH)
      setError(contentError, 'Zawartość artykułu jest za długa');
    else
      clearError(contentError);

    // Attractions
    if (this.EditAttractions.length === 0)
      setError(attractionError, 'Artykuł musi posiadać przynajmniej jedną atrakcję');
    else if (this.EditAttractions.length > this.MAX_ATTRACTION_NUMBER)
      setError(attractionError, 'Artykuł może posiadać maksymalnie 30 atrakcji');
    else
      clearError(attractionError);

    return valid;
  }
}
