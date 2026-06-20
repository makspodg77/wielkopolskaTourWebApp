namespace Project1.Models
{
    public class Comment
    { 
        public int Id { get; set; }
        public string Content { get; set; }
        public Guid UserId { get; set; }
        public int Likes { get; set; }
        public DateTime DateAdded { get; set; }
        public int ArticleId { get; set; }

    }
}
