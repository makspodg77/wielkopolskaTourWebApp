    using Project1.Models;

namespace Project1.Interfaces
{
    public interface ICommentRepository
    {
        ICollection<Comment> GetAllComments();
        ICollection<Comment> GetArticlesComments(int articleId);
        Comment GetComment(int commentId);
        bool AddComment(Comment comment);
        bool DeleteComment(int commentId);
        int NumberOfArticleComments(int articleId);
        bool CommentExists(int commentId);
        bool LikeAComment(Comment comment);
        bool Save();
    }
}
