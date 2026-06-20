using Microsoft.AspNetCore.Identity;
using Project1.Models;

namespace Project1.Interfaces
{
    public interface IUserRepository
    {
        ICollection<User> GetUsers();
        User GetUser(string id);
        ICollection<Article> GetArticlesByUser(Guid id);
        bool UserExists(Guid id);
        ICollection<IdentityRole> GetAllRanks();
        bool putUserRole(Role role);
        string GetUserRole(string id);
        bool deleteUser(string userId);

        int NumberOfCommentsByUser(string userId);
        int NumberOfArticlesByUser(string userId);
        int NumberOfLikedArticlesByUser(string userId);
        bool Save();
    }
}
