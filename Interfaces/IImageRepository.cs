using Project1.Models;

namespace Project1.Interfaces
{
    public interface IImageRepository
    {
        ICollection<Image> GetImages();
        Image GetImage(int id);
        bool ImageExists(int id);
        ICollection<Image> GetArticlesImages(int artykulId);
        Image GetArticlesFirstImage(int artykulId);
        bool AddImage(Image image);
        bool DeleteImage(int id);
        bool Save();
    }
}
