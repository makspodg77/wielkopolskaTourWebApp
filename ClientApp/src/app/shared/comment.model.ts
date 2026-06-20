export class Comment {
  id: number = 0;
  content: string = '';
  userId: string | undefined ;
  likes: number = 0;
  dateAdded: Date = new Date();
  articleId: number = 0;
}
