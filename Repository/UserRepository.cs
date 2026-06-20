using Microsoft.EntityFrameworkCore;
using Project1.Data;
using Project1.Interfaces;
using Project1.Models;
using System.Collections;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Text;

namespace Project1.Repository
{
    public class UserRepository : IUserRepository
    {
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public ICollection<Article> GetArtykulyByUzytkownik(Guid id)
        {
            return _context.Articles.Where(r => r.UserId == id).ToList();
        }

        public ICollection<User> GetUzytkownicy()
        {
            return _context.Users.ToList();
        }

        public bool Save()
        {
            var save = _context.SaveChanges();
            return save > 0 ? true : false; 
        }

        public bool UpdateUzytkownik(User uzytkownik)
        {
            _context.Update(uzytkownik);
            return Save();
        }

        public bool uzytkownikCreate(User uzytkownik)
        {
            //SHA256 hash = SHA256.Create();
            //var passwordBytes = Encoding.Default.GetBytes(uzytkownik.Password);
            // var hashedpassword = hash.ComputeHash(passwordBytes);

            //uzytkownik.Password = Convert.ToHexString(hashedpassword);
            //_context.Add(uzytkownik);
            //return Save();
            return true;
        }

        public bool UzytkownikExists(Guid id)
        {
            //return _context.MPuzytkownik.Any(r => r.Id == id);
            return true;
        }

        public ICollection<User> GetUsers()
        {
            return _context.Users.ToArray();
        }

        public User GetUser(string id)
        {
            return _context.Users.Where(a => a.Id == id).FirstOrDefault();
        }

        public ICollection<Article> GetArticlesByUser(Guid id)
        {
            throw new NotImplementedException();
        }

        public bool UserExists(Guid id)
        {
            throw new NotImplementedException();
        }

        public string GetUserRole(string id)
        {
            var roleId = _context.UserRoles.Where(c => c.UserId == id).FirstOrDefault();
            var role = _context.Roles.Where(c => c.Id == roleId.RoleId).FirstOrDefault();
            return role.Name;
        }

        public ICollection<IdentityRole> GetAllRanks()
        {
            var roles = _context.Roles.ToArray();
            return roles;
        }

        public bool putUserRole(Role role)
        {
            var userRole = _context.UserRoles.Where(_c => _c.UserId == role.UserId).FirstOrDefault();
            _context.UserRoles.Remove(userRole);
            _context.SaveChanges();
            if (userRole != null)
            {
                userRole.RoleId = role.RoleId.ToString();
            }
            _context.UserRoles.Add(userRole);
            return Save();
        }

        public bool deleteUser(string userId)
        {
            foreach(var article in _context.Articles) 
            {
                if(article.UserId.ToString() == userId)
                {
                    foreach(var image in _context.Images)
                    {
                        if(image.ArticleId == article.Id)
                        {
                            _context.Images.Remove(image);
                            _context.SaveChanges();
                        }
                    }
                    foreach(var articlesAttraction in _context.ArticlesAttractions)
                    {
                        if(articlesAttraction.ArticleId == article.Id) 
                        {
                            _context.ArticlesAttractions.Remove(articlesAttraction);
                            _context.SaveChanges();
                        }
                    }
                    foreach(var like in _context.Likes)
                    {
                        if (like.ArticleId == article.Id)
                        {
                            _context.Likes.Remove(like);
                            _context.SaveChanges();
                        }
                    }
                    _context.Articles.Remove(article);
                    _context.SaveChanges();
                }
            }
            User user = _userManager.FindByIdAsync(userId).Result;
            IdentityUserRole<string>? userRole = _context.UserRoles.Where(c => c.UserId== userId).FirstOrDefault();
            _context.UserRoles.Remove(userRole);
            _context.Users.Remove(user);
            return Save();
        }

        public int NumberOfCommentsByUser(string userId)
        {
            return _context.Comments.Where(c => c.UserId.ToString() == userId).ToList().Count();
        }

        public int NumberOfArticlesByUser(string userId)
        {
            return _context.Articles.Where(c => c.UserId.ToString().Equals(userId)).ToList().Count();
        }

        public int NumberOfLikedArticlesByUser(string userId)
        {
            return _context.Likes.Where(c => c.UserId.ToString().Equals(userId)).ToList().Count();
        }
    }
}
