using Microsoft.AspNetCore.Mvc;
using Project1.Models;

namespace Project1.Interfaces
{
    public interface IAttractionRepository
    {
        ICollection<Attraction> GetAttractions();
        Attraction GetAttraction(int id);
        ICollection<dynamic> GetArticleByAttraction(int attractionId);
        bool AttractionExists(int id);
        bool CreateAttraction(Attraction attraction);
        bool Save();
        bool UpdateAttraction(Attraction attraction);
        ICollection<Attraction> GetArticlesAttraction(int articleId);
        IEnumerable<dynamic> GetMostPopularAttractions();
    }
}
