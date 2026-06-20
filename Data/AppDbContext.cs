using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Project1.Models;

namespace Project1.Data
{
    public class AppDbContext : IdentityDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Article> Articles { get;set; }
        public DbSet<Attraction> Attractions { get;set; }    
        public DbSet<ArticlesAttraction> ArticlesAttractions { get;set; }
        public new DbSet<User> Users { get; set; }
        public DbSet<Image> Images { get;set; }
        public DbSet<Comment> Comments { get;set; }
        public DbSet<Like> Likes { get;set; }
        public DbSet<Message> Messages { get;set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
