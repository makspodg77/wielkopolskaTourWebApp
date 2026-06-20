import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Article } from '../shared/article.model';
import { ExploreArticle } from '../shared/finalarticle.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  currentRoute: string = "";
  word2: string = "";
  flag: boolean = false;
  filter: number = 5;
  filter2: number = 5;
  pagesize2: string = "";
  constructor(public service: DatabaseService, private route: ActivatedRoute, private router: Router) {
    this.currentRoute = window.location.pathname + window.location.search;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (this.currentRoute != event.url) {
          this.stateOfComponent = 0;
          this.ArticleList = [];
          if ((event.url).search(/word/gi) != -1) {
            var temp = ""
            for (let i = (event.url).search(/word/gi) + 5; i < event.url.length; i++) {
              if (event.url[i] == '&')
                break;

              temp += event.url[i];
            }
            this.word2 = temp;
          }
          else {
            this.word2 = "";
          }
          if ((event.url).search(/page-size/gi) != -1) {
            var temp = ""
            for (let i = (event.url).search(/page-size/gi) + 10; i < event.url.length; i++) {
              if (event.url[i] == '&')
                break;

              temp += event.url[i];
            }
            this.pagesize2 = temp;
          }
          if ((event.url).search(/filter/gi) != -1) {
            var temp = ""
            for (let i = (event.url).search(/page-size/gi) + 7; i < event.url.length; i++) {
              if (event.url[i] == '&')
                break;

              temp += event.url[i];
            }
            this.filter2 = Number(temp);
          }
          this.ngOnInit();
          this.currentRoute = event.url;
        }
      }
    });
  }
  stateOfComponent: number = 0;
  ArticleList: ExploreArticle[] = [];
  commentsNumber: any;
  FinalArticleList: any = [];
  ArticlesImage: any;
  likesNumber: any;
  text: string = "";
  isMap: boolean = false;

  word: string = "";
  pageSize: number = 0;
  nextPage: boolean = false;
  noArticles: string = "";
  FinalFinalArticleList: any = [];

  ngOnInit(): void {
    if (this.pagesize2 != "" || this.word2 != "") {
      this.word = this.word2;
      this.pageSize = parseInt(this.pagesize2);
    }
    else {
      this.route.queryParams.subscribe(params => {
        if (params['word'] != undefined)
          this.word = params['word'];
        this.pageSize = params['page-size'];
        this.filter = params['filter'];

      });
    }
    this.getArticles();
  }
  sort() {
    if (this.filter == 0) {
      this.ArticleList.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (this.filter == 1) {
      this.ArticleList.sort((a, b) => b.title.localeCompare(a.title));
    }
    if (this.filter == 2) {
      this.ArticleList.sort((a, b) => a.likes - b.likes);
    }
    if (this.filter == 3) {
      this.ArticleList.sort((a, b) => b.likes - a.likes);
    }
    if (this.filter == 4) {
      for (let i = 0; i < this.FinalArticleList.length; i++) {
        for (let j = i + 1; j < this.FinalArticleList.length; j++) {
          if (this.FinalArticleList[i].date > this.FinalArticleList[j].date) {
            var temp = this.FinalArticleList[i];
            this.FinalArticleList[i] = this.FinalArticleList[j];
            this.FinalArticleList[j] = temp;
          }
        }
      }
    }
    if (this.filter == 5) {
      for (let i = 0; i < this.FinalArticleList.length; i++) {
        for (let j = i + 1; j < this.FinalArticleList.length; j++) {
          if (this.FinalArticleList[i].date < this.FinalArticleList[j].date) {
            var temp = this.FinalArticleList[i];
            this.FinalArticleList[i] = this.FinalArticleList[j];
            this.FinalArticleList[j] = temp;
          }
        }
      }
    }
    if (this.filter == 6) {
      this.ArticleList.sort((a, b) => a.numberOfComments - b.numberOfComments);
    }
    if (this.filter == 7) {
      this.ArticleList.sort((a, b) => b.numberOfComments - a.numberOfComments);
    }
    this.FinalFinalArticleList = this.FinalArticleList.slice(0, this.pageSize);
  }
  onChange(event: Event) {
    var filterSelect: HTMLSelectElement = event.target as HTMLSelectElement;
    this.filter = Number(filterSelect.value);
    this.router.navigate([], { queryParams: {'filter': this.filter }, queryParamsHandling: 'merge' }); 
    this.sort();
  }

  public async getArticles() {
    if (this.word.length == 0) {
      this.service.getDepList().subscribe(data => {
        this.ArticleList = data;       
        this.finalizeArticles();

        if (this.ArticleList.length == 0)
          this.stateOfComponent = 1;
        else
          this.stateOfComponent = 2;
      });
      this.text = "Wszystkie artykuły";
    }
    else {
      this.service.search(this.word).subscribe(data => {
        this.ArticleList = data;
        this.service.search2(this.word).subscribe(data2 => {
          for (let i = 0; i < data2.length; i++) {
            this.ArticleList.push(data2[i]);
          }
          this.text = "Szukana fraza: " + this.word;
          this.finalizeArticles();

          if (this.ArticleList.length == 0)
            this.stateOfComponent = 1;
          else
            this.stateOfComponent = 2;
        });
      });
    }

  }

  async finalizeArticles() {
    var filterSelect: HTMLSelectElement = document.getElementById("selectInput") as HTMLSelectElement;
    filterSelect.selectedIndex = this.filter;

    for (let i = 0; i < this.ArticleList.length; i++) {

      if (this.ArticleList[i].image != null && this.ArticleList[i].image != "") {
        this.ArticleList[i].image = this.service.makeImageUrl(this.ArticleList[i].image);
            }
            else
        this.ArticleList[i].image = "./assets/patologia.jpg";

    }

    this.ArticleList = this.deleteDuplicates()

    if (this.ArticleList.length > this.pageSize)
      this.nextPage = true;

    this.sort();

    this.FinalFinalArticleList = this.ArticleList.slice(0, this.pageSize);
  }

  moreArticles() {
    this.router.navigate([], { queryParams: { 'page-size': 8 + Number(this.pageSize), 'filter': this.filter }, queryParamsHandling: 'merge' }).then(() => window.location.reload()); 
  }

  deleteDuplicates(): any[] {
    var arr = [];
    for (let i = 0; i < this.ArticleList.length; i++) {
      var flag = true;
      for (let j = 0; j < arr.length; j++) {
        if (this.ArticleList[i].id == arr[j].id) 
          flag = false
      }
      if (flag) 
        arr.push(this.ArticleList[i])
    }
    return arr;
  }
}
