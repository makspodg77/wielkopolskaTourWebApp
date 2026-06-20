using Project1.Data;
using Project1.Interfaces;
using Project1.Models;

namespace Project1.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _context;
        public CommentRepository(AppDbContext context) 
        {
            _context = context;
        }

        public bool AddComment(Comment comment)
        {
            _context.Add(comment); 
            return Save();
        }

        public bool CommentExists(int CommentId)
        {
            return _context.Comments.Where(a => a.Id == CommentId).Any();
        }

        public bool DeleteComment(int CommentId)
        {
            var comment = _context.Comments.Where(a => a.Id == CommentId).FirstOrDefault();
            _context.Comments.Remove(comment);
            return Save();
        }

        public ICollection<Comment> GetAllComments()
        {
            return _context.Comments.ToList();
        }

        public ICollection<Comment> GetArticlesComments(int ArticleId)
        {
            return _context.Comments.Where(a => a.ArticleId == ArticleId).OrderByDescending(a => a.DateAdded).ToList();
        }

        public Comment GetComment(int CommentId)
        {
            return _context.Comments.Where(a => a.Id == CommentId).FirstOrDefault();
        }

        public bool LikeAComment(Comment comment)
        {
            comment.Likes++;
            _context.Comments.Update(comment);
            return Save();
        }

        public int NumberOfArticleComments(int articleId)
        {
            return _context.Comments.Where(a => a.ArticleId == articleId).Count();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
