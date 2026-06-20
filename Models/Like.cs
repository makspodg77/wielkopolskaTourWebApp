namespace Project1.Models
{
    public class Like
    {
        public Like(int articleId, Guid userId)
        {
            ArticleId = articleId;
            UserId = userId;
        }

        public int Id { get; set; }
        public Guid UserId { get; set; }
        public int ArticleId { get; set; }
    }
}
