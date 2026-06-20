using Project1.Data;
using Project1.Interfaces;
using Project1.Models;

namespace Project1.Repository
{
    public class ArticlesAttractionRepository : IArticlesAttractionRepository
    {
        private readonly AppDbContext _context;
        
        public ArticlesAttractionRepository(AppDbContext context)
        {
            _context = context;
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool ArticlesAttractionExists(int artykulId, int atrakcjaId)
        {
            return _context.ArticlesAttractions.Any(a => a.AttractionId == atrakcjaId && a.ArticleId == artykulId);
        }

        public bool AddArticlesAttraction(int articleId, int attractionId)
        {
            var AtrakcjaArtykulu = new ArticlesAttraction()
            {
                ArticleId = articleId,
                AttractionId = attractionId,
            };
            _context.Add(AtrakcjaArtykulu);
            return Save();
        }

        public bool removeArticlesAttraction(int articleId, int attractionId)
        {
            var attraction = _context.ArticlesAttractions.Where(p => p.ArticleId == articleId).Where(a => a.AttractionId == attractionId).FirstOrDefault();
            _context.ArticlesAttractions.Remove(attraction);
            return Save();
        }
    }
}
