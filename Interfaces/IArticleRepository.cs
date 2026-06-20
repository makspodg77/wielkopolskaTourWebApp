using Project1.Models;

namespace Project1.Interfaces
{
    public interface IArticleRepository
    {
        ICollection<FinalArticle> GetArticles();
        Article GetNewestArticle();
        Article GetArticle(int id);

        bool ArticleExists(int id);

        bool CreateArticle(Article article);
        bool deleteArticle(Article article);

        User GetArticlesAuthor(int id);

        ICollection<FinalArticle> search(string ex);
        ICollection<FinalArticle> search2(string ex);

        bool UpdateArticle(Article article);

        bool AddLike(Article article);

        bool Save();
    }
}
