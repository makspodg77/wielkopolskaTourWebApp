using Project1.Models;

namespace Project1.Dto
{
    public class ArticleDto
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }

        public DateTime Date { get; set; }

        public string? MapLink { get; set; }

        public Guid UserId { get; set; }
        public DateTime? lastUpdate { get; set; }
    }
}
