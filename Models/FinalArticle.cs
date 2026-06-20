namespace Project1.Models
{
    public class FinalArticle
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public Guid UserId { get; set; }
        public string? MapLink { get; set; }
        public DateTime? lastUpdate { get; set; }
        public int numberOfComments { get; set; }
        public string image { get; set; }
        public int likes { get; set; }
    }
}
