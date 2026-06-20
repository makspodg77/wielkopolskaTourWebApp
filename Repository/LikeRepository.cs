using Project1.Data;
using Project1.Interfaces;
using Project1.Models;
using static System.Net.Mime.MediaTypeNames;

namespace Project1.Repository
{
    public class LikeRepository : ILikeRepository
    {
        private readonly AppDbContext _context;
        public LikeRepository(AppDbContext context)
        {
            _context = context;
        }

        public bool AddLike(int articleId, Guid userId)
        {
            _context.Add(new Like(articleId: articleId, userId: userId));
            return Save();
        }

        public ICollection<Like> GetAllArticleLikes(int articleId)
        {
            return _context.Likes.Where(a => a.ArticleId == articleId).ToList();
        }

        public ICollection<Like> GetAllLikes()
        {
            return _context.Likes.ToList();
        }

        public ICollection<Like> GetAllUserLikes(Guid userId)
        {
            return _context.Likes.Where(a => a.UserId == userId).ToList();
        }

        public Like GetArticlesAllLikes(int articleId)
        {
            throw new NotImplementedException();
        }

        public int GetNumberOfArticleLikes(int articleId)
        {
            return _context.Likes.Where(a => a.ArticleId == articleId).Count();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool likeExists(Guid userId, int articleId)
        {
            return _context.Likes.Any(d => d.UserId == userId && articleId == d.ArticleId);
        }
    }
}
