using Microsoft.EntityFrameworkCore;
using Project1.Data;
using Project1.Interfaces;
using Project1.Models;

namespace Project1.Repository
{
    public class ImageRepository : IImageRepository
    {
        private readonly AppDbContext _context;

        public ImageRepository(AppDbContext context)
        {
            _context = context;
        }

        public bool AddImage(Image image)
        {
            Console.WriteLine(image);
            _context.Add(image);
            return Save();
        }

        public bool DeleteImage(int id)
        {

            var image = _context.Images.Where(p => p.Id == id).FirstOrDefault();
            var folderName = Path.Combine("wwwroot", "Resources", "Images");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = image.Name;
            var fullPath = Path.Combine(pathToSave, fileName);

            FileInfo file1 = new FileInfo(fullPath);
            if (file1.Exists)
            {
                file1.Delete();
            }

            _context.Images.Remove(image);
            return Save();
        }

        public Image GetArticlesFirstImage(int artykulId)
        {
            return _context.Images.Where(a => a.ArticleId == artykulId).FirstOrDefault();
        }

        public ICollection<Image> GetArticlesImages(int artykulId)
        {
            return _context.Images.Where(a => a.ArticleId== artykulId).ToList();
        }

        public Image GetImage(int id)
        {
            return _context.Images.Where(a => a.Id == id).FirstOrDefault();
        }

        public ICollection<Image> GetImages()
        {
            return _context.Images.ToList();
        }

        public bool ImageExists(int id)
        {
            if(_context.Images.Where(a => a.Id == id).Any()) return true;
            return false;
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

    }
}
