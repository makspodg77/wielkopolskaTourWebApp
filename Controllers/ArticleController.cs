using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Project1.Dto;
using Project1.Interfaces;
using Project1.Models;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : Controller
    {
        private readonly IArticleRepository _artykulRepository;
        private readonly IUserRepository _uzytkownikRepository;
        private readonly IMapper _mapper;

        public ArticleController(IArticleRepository artykulRepository, IUserRepository uzytkownikRepository, IMapper mapper)
        {
            _uzytkownikRepository = uzytkownikRepository;
            _artykulRepository = artykulRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Article>))]

        public IActionResult GetArtykuly()
        {
            var artykuly = _artykulRepository.GetArticles();

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(artykuly);
        }

        [HttpGet("Uzytkownik/{id}")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        public  IActionResult GetArtykulOwner(int id)
        {
            var uzytkownik = _artykulRepository.GetArticlesAuthor(id);
            return Ok(uzytkownik);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Article))]
        [ProducesResponseType(400)]

        public IActionResult GetArtykul(int id)
        {
            if(!_artykulRepository.ArticleExists(id)) 
            {
                return NotFound();
            }

            var artykul = _mapper.Map<ArticleDto>(_artykulRepository.GetArticle(id));

            if(!ModelState.IsValid) 
            {
                return BadRequest(ModelState);
            }

            return Ok(artykul);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]

        public IActionResult CreateArtykul([FromBody] ArticleDto createArtykul)
        {
            if(createArtykul == null)
                return BadRequest(ModelState);

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var artykulMap = _mapper.Map<Article>(createArtykul);
            
            if(!_artykulRepository.CreateArticle(artykulMap))
            {
                ModelState.AddModelError("", "Something went wrong while savin");
                return StatusCode(500, ModelState);
            }
            return Ok(artykulMap);
        }

        [HttpPut("{artykulId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]

        public IActionResult UpdateArtykul(int artykulId, [FromBody] ArticleDto updatedArtykul)
        {
            if(updatedArtykul == null)
                return BadRequest(ModelState);

            if(artykulId != updatedArtykul.Id)
                return BadRequest(ModelState);

            if(!_artykulRepository.ArticleExists(artykulId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var artykulMap = _mapper.Map<Article>(updatedArtykul);

            if(!_artykulRepository.UpdateArticle(artykulMap))
            {
                ModelState.AddModelError("", "Something went wrong updating owner");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpPut("AddLike")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]

        public IActionResult AddLike(int artykulId, [FromBody] ArticleDto updatedArtykul)
        {
            if (updatedArtykul == null)
                return BadRequest(ModelState);

            if (artykulId != updatedArtykul.Id)
                return BadRequest(ModelState);

            if (!_artykulRepository.ArticleExists(artykulId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var artykulMap = _mapper.Map<Article>(updatedArtykul);

            if (!_artykulRepository.AddLike(artykulMap))
            {
                ModelState.AddModelError("", "Something went wrong updating owner");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpGet("GetUser/{UserId}")]
        public User GetUserById(string UserId)
        {
            return _uzytkownikRepository.GetUser(UserId);
        }

        [HttpGet("NewestArticle")]
        public Article GetNewestArticle()
        {
            return _artykulRepository.GetNewestArticle();
        }

        [HttpGet("Search/{ex}")]
        public ICollection<FinalArticle> Search(string ex)
        {
            return _artykulRepository.search(ex);
        }

        [HttpGet("Search2/{ex}")]
        public ICollection<FinalArticle> Search2(string ex)
        {
            return _artykulRepository.search2(ex);
        }

        [HttpDelete("{id}")]
        public bool Delete(int id)
        {
            var article = _artykulRepository.GetArticle(id);

            return _artykulRepository.deleteArticle(article);
        }
    }
}
