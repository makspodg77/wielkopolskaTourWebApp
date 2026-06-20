using System.ComponentModel.DataAnnotations.Schema;

namespace Project1.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; }
        [Column(TypeName = "nvarchar(4000)")]
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public Guid UserId { get; set; }
        public string? MapLink { get; set; }
        public DateTime? lastUpdate { get; set; }
    }
}
