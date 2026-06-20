using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Project1.Data;
using Project1.Interfaces;
using Project1.Models;
using System.Collections.Generic;

namespace Project1.Repository
{
    public class AttractionRepository : IAttractionRepository
    {
        private readonly AppDbContext _context;
        public AttractionRepository(AppDbContext context)
        {
            _context = context;
        }

        public bool AttractionExists(int id)
        {
            return _context.Attractions.Any(a => a.Id == id);
        }

        public bool CreateAttraction(Attraction attraction)
        {
            _context.Add(attraction);
            return Save();
        }

        public ICollection<dynamic> GetArticleByAttraction(int attractionId)
        {
            object[] doris = Array.Empty<object>();
            var alko = _context.ArticlesAttractions.Where(e => e.AttractionId == attractionId).ToList();
            foreach (var article in alko)
            {
                _ = doris.Append(_context.Attractions.Where(a => a.Id == article.AttractionId).FirstOrDefault());
            }
            return doris;
        }

        public ICollection<Attraction> GetArticlesAttraction(int articleId)
        {

            return (from s in _context.Attractions from k in _context.ArticlesAttractions where s.Id == k.AttractionId where k.ArticleId == articleId select s).ToList();
        }

        public Attraction GetAttraction(int id)
        {
            return _context.Attractions.Where(p => p.Id == id).FirstOrDefault();
        }

        public ICollection<Attraction> GetAttractions()
        {
            return _context.Attractions.ToList();
        }

        public IEnumerable<dynamic> GetMostPopularAttractions()
        {
            var list = _context.ArticlesAttractions
            .Join(_context.Attractions, a => a.AttractionId, b => b.Id, (a, b) => new { Id = a.AttractionId, b.Type })
            .GroupBy(a => a.Id)
            .Select(g => new { Id = g.Key, Number = g.Count()})
            .OrderByDescending(a => a.Number);
            return list;
        }

        public bool Save()
        {
            var save = _context.SaveChanges();
            return save > 0;
        }

        public bool UpdateAttraction(Attraction attraction)
        {
            _context.Update(attraction);
            return Save();
        }
    }
}
