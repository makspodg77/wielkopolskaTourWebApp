using Project1.Models;

namespace Project1.Interfaces
{
    public interface ILikeRepository
    {
        ICollection<Like> GetAllLikes();
        Like GetArticlesAllLikes(int articleId);
        int GetNumberOfArticleLikes(int articleId);
        ICollection<Like> GetAllUserLikes(Guid userId);
        ICollection<Like> GetAllArticleLikes(int articleId);
        bool likeExists(Guid userId, int articleId);
        bool Save();
        bool AddLike(int articleId, Guid userId);
    }
}
