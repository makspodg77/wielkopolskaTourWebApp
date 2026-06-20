using Project1.Data;
using Project1.Interfaces;
using Project1.Models;
using Project1.Repository;
using System.Linq;

namespace Project1.Repository
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly AppDbContext _context;
        private readonly ICommentRepository _commentRepository;
        private readonly ILikeRepository _likeRepository;
        private readonly IImageRepository _imageRepository;

        public ArticleRepository(AppDbContext context, ICommentRepository commentRepository, ILikeRepository likeRepository, IImageRepository imageRepository)
        {
            _context = context;
            _commentRepository = commentRepository;
            _likeRepository = likeRepository;
            _imageRepository = imageRepository;
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool AddLike(Article article)
        {
            return Save();
        }

        public ICollection<FinalArticle> GetArticles()
        {
            var articles = _context.Articles.OrderByDescending(p => p.Id).ToList();
            List<FinalArticle> finalArticles = new List<FinalArticle>();
            foreach(var article in articles) 
            {
                FinalArticle facade = new FinalArticle();
                facade.Id = article.Id;
                facade.Title = article.Title;
                facade.lastUpdate = article.lastUpdate;
                facade.Content = article.Content;
                facade.Date = article.Date;
                facade.likes = _likeRepository.GetNumberOfArticleLikes(article.Id);
                
                Image image = _imageRepository.GetArticlesFirstImage(article.Id);
                if(image != null) { facade.image = image.ImageCode; }

                facade.numberOfComments = _commentRepository.NumberOfArticleComments(article.Id);
                finalArticles.Add(facade);
            }
            return finalArticles;
        }

        public Article GetArticle(int id)
        {
            return _context.Articles.Where(p => p.Id == id).FirstOrDefault();
        }

        public bool ArticleExists(int id)
        {
            return _context.Articles.Any(p => p.Id == id);
        }

        public bool CreateArticle(Article article)
        {
            _context.Add(article);

            return Save();
        }

        public User GetArticlesAuthor(int id)
        {
            throw new NotImplementedException();
        }

        public bool UpdateArticle(Article article)
        {
            _context.Update(article);
            return Save();
        }

        public ICollection<FinalArticle> search(string ex)
        {
            var articles = _context.Articles.Where(t => t.Content.Contains(ex) || t.Title.Contains(ex) || t.Title.Contains(ex)).ToList();
            List<FinalArticle> finalArticles = new List<FinalArticle>();
            foreach (var article in articles)
            {
                FinalArticle facade = new FinalArticle();
                facade.Id = article.Id;
                facade.Title = article.Title;
                facade.lastUpdate = article.lastUpdate;
                facade.Content = article.Content;
                facade.Date = article.Date;
                facade.likes = _likeRepository.GetNumberOfArticleLikes(article.Id);

                Image image = _imageRepository.GetArticlesFirstImage(article.Id);
                if (image != null) { facade.image = image.ImageCode; }

                facade.numberOfComments = _commentRepository.NumberOfArticleComments(article.Id);
                finalArticles.Add(facade);
            }
            return finalArticles;
        }

        public ICollection<FinalArticle> search2(string ex)
        {
            List<Article> list = new List<Article>();
            var attractions = _context.Attractions.Where(t => t.Type.Contains(ex)).ToList();
            foreach(var attraction in attractions)
            {
                foreach(var book in _context.ArticlesAttractions.ToList()) 
                {
                    if(attraction.Id == book.AttractionId)
                    {
                        var article = _context.Articles.Where(c => c.Id == book.ArticleId).FirstOrDefault();
                        list.Add(article);
                    }
                }
            }
            List<FinalArticle> finalArticles = new List<FinalArticle>();
            foreach (var article in list)
            {
                FinalArticle facade = new FinalArticle();
                facade.Id = article.Id;
                facade.Title = article.Title;
                facade.lastUpdate = article.lastUpdate;
                facade.Content = article.Content;
                facade.Date = article.Date;
                facade.likes = _likeRepository.GetNumberOfArticleLikes(article.Id);

                Image image = _imageRepository.GetArticlesFirstImage(article.Id);
                if (image != null) { facade.image = image.ImageCode; }

                facade.numberOfComments = _commentRepository.NumberOfArticleComments(article.Id);
                finalArticles.Add(facade);
            }
            return finalArticles;
        
    }

        public Article GetNewestArticle()
        {
            return _context.Articles.OrderByDescending(i => i.Id).FirstOrDefault(); 
        }

        public bool deleteArticle(Article article)
        {
            foreach(var like in _context.Likes.Where(a => a.ArticleId == article.Id)) 
            { 
                _context.Likes.Remove(like);
            }

            foreach (var comment in _context.Comments.Where(a => a.ArticleId == article.Id))
            {
                _context.Comments.Remove(comment);
            }

            foreach (var image in _context.Images.Where(a => a.ArticleId == article.Id))
            {
                _context.Images.Remove(image);
            }

            foreach (var attraction in _context.ArticlesAttractions.Where(a => a.ArticleId == article.Id))
            {
                _context.ArticlesAttractions.Remove(attraction);
            }

            _context.Articles.Remove(article);

            return Save();
        }
    }
}
