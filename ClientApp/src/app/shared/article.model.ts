import { Guid } from "guid-typescript";

export class Article {
  id: number = 0;
  title: string = '';
  content: string = '';
  date: Date = new Date();
  mapLink: string = '';
  userId: string | undefined;
}
