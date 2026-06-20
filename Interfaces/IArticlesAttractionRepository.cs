namespace Project1.Interfaces
{
    public interface IArticlesAttractionRepository
    {
        bool AddArticlesAttraction(int articleId, int attractionId);
        bool removeArticlesAttraction(int articleId, int attractionId);
        bool ArticlesAttractionExists(int articleId, int attractionId);
        bool Save();
    }
}
