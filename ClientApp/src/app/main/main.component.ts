import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DatabaseService } from '../shared/database.service'
import { Attraction } from '../shared/attraction.model';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import Matter from 'matter-js';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
  attractionRanking: any = [];
  attraction: any;
  newestArticle: any;
  newestArticleId: number = 0;
  ArticlesImage: any;
  finalArticle: any;
  currentRoute: any;
  finalAttractionRanking: any = [];
  flag: boolean = false;
  constructor(private service: DatabaseService, private router: Router) {
    this.currentRoute = window.location.pathname + window.location.search;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (this.currentRoute != event.url) {

        }
      }
    })}

  rankingType: boolean = false;
  ngOnInit(): void {
    this.getRanking();
    this.getNewestArticle();
    this.flag = false;
  }

  doris() {
    var woj;
    var doris: any;
    var tom: any;
    var koniara: any;
    const THICCNESS = 60;
    if (document.querySelector(".text") != undefined) {
      const matterContainer = document.querySelector(".text") as HTMLElement;
      const getRandomColor = () => {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) { color += letters[Math.floor(Math.random() * 16)]; }
        return color;
      }; const splitWords = () => {
        const textNode = matterContainer;
        const text = textNode?.textContent;
        var i = 6.5;
        const newDomElements = text?.split("/").map((text) => {
          let color = getRandomColor(); i = i - 0.5;
          return `<span style="user-select: none; font-size: ${i}em; color: ${color}; position: absolute; cursor: grab;" class="word">${text}</span>`;
        });
        textNode!.innerHTML = newDomElements!.join("");
      }; const renderCanvas = () => {
        var Engine = Matter.Engine;
        var Render = Matter.Render;
        var World = Matter.World;
        var Bodies = Matter.Bodies;
        var Runner = Matter.Runner;
        var params = { isStatic: true, render: { fillStyle: "transparent" } };
        var canvasSize = { width: matterContainer!.clientWidth, height: matterContainer!.clientHeight };
        var engine = Engine.create({});
        var render = Render.create({ element: matterContainer, engine: engine, options: { ...canvasSize, background: "transparent", wireframes: false } });
        koniara = render;
        var floor = Bodies.rectangle(canvasSize.width / 2, canvasSize.height + 230, canvasSize.width * 3, 500, params);
        doris = floor;
        var wall1 = Bodies.rectangle(-230, canvasSize.height / 2, 500, canvasSize.height * 3, params);
        woj = wall1;
        var wall2 = Bodies.rectangle(canvasSize.width + 480, canvasSize.height / 2, 1000, canvasSize.height * 3, params);
        tom = wall2; var top = Bodies.rectangle(canvasSize.width / 2, -230, canvasSize.width * 3, 500, params);
        var wordElements = document.querySelectorAll(".word");
        var wordBodies = [...wordElements].map((elemRef) => {
          const width = (elemRef as any).offsetWidth;
          const height = (elemRef as any).offsetHeight;
          return {
            body: Matter.Bodies.rectangle(canvasSize.width / 2, 70, width, height, { render: { fillStyle: "transparent" } }), elem: elemRef, render() {
              const { x, y } = this.body.position; (this.elem as any).style.top = `${y - 20}px`;
              (this.elem as any).style.left = `${x - width / 2}px`; (this.elem as any).style.transform = `rotate(${this.body.angle}rad)`;
            }
          };
        }); var mouse = Matter.Mouse.create(document.getElementById("text") as HTMLElement);
        var mouseConstraint = Matter.MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
        World.add(engine.world, [floor, ...wordBodies.map((box) => box.body), wall1, wall2, top, mouseConstraint]);
        render.mouse = mouse; Runner.run(engine); Render.run(render); (function rerender() {
          wordBodies.forEach((element) => { element.render(); });
          Matter.Engine.update(engine); requestAnimationFrame(rerender);
        })();
      };
      function handleResize(matterContainer: HTMLElement) {
        koniara.canvas.width = matterContainer.clientWidth;
        koniara.canvas.height = matterContainer.clientHeight;

        Matter.Body.setPosition(doris, Matter.Vector.create(matterContainer.clientWidth / 2, matterContainer.clientHeight + 230));
        Matter.Body.setPosition(tom, Matter.Vector.create(matterContainer.clientWidth + 480, matterContainer.clientHeight / 2));
      }
      window.addEventListener("resize", () => handleResize(matterContainer));
      if (document.readyState !== "loading") { splitWords(); renderCanvas(); }
      else { window.addEventListener("DOMContentLoaded", (event) => { splitWords(); renderCanvas(); }); }
      }
     
  }

  public async getNewestArticle() {
    this.service.getNewestAricle().subscribe(data => {
      this.newestArticle = data;
      this.newestArticleId = data.id
      this.service.getArticlesFirstImage(this.newestArticle.id).subscribe(data2 => {
        this.ArticlesImage = data2;
        if (this.ArticlesImage != null)
          this.ArticlesImage = this.service.makeImageUrl(this.ArticlesImage.imageCode);
        else
          this.ArticlesImage = "./assets/patologia.jpg";

        this.newestArticle = {
          ...this.newestArticle, ...{ image: this.ArticlesImage }
        };
      });
    });
  }

  public async getRanking() {
    this.attractionRanking = await new Promise<object[]>(resolve => 
      this.service.getMostPopularAttractions().subscribe(resolve));

    this.attractionRanking = this.attractionRanking.slice(0, 9);

    for (let i = 0; i < this.attractionRanking.length; i++) {
      this.attraction = await new Promise<Attraction>(resolve => {
        this.service.getAtrakcjaById(this.attractionRanking[i].id).subscribe(resolve)
      });

      this.finalAttractionRanking.push({
        ...this.attractionRanking[i], ...this.attraction
      });

      var obj = document.querySelector(".text");
      if (obj) {
        obj.innerHTML = obj.innerHTML + this.attraction.type + "/";
      }
    }
    this.doris();
  }
}
