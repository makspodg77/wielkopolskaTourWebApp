using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Project1.Dto;
using Project1.Interfaces;
using Project1.Models;
using Project1.Repository;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttractionController : Controller
    {
        private readonly IAttractionRepository _atrakcjaRepository;
        private readonly IMapper _mapper;
        public AttractionController(IAttractionRepository atrakcjaRepository, IMapper mapper)
        {
            _atrakcjaRepository = atrakcjaRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Attraction>))]
        public IActionResult GetAtrakcje()
        {
            var atrakcja = _mapper.Map<List<AttractionDto>>(_atrakcjaRepository.GetAttractions());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(atrakcja);
        }

        [HttpGet("{atrakcjaId}")]
        [ProducesResponseType(200, Type = typeof(Attraction))]
        [ProducesResponseType(400)]
        public IActionResult GetAtrakcja(int atrakcjaId)
        {
            if (!_atrakcjaRepository.AttractionExists(atrakcjaId))
            {
                return NotFound();
            }

            var atrakcja = _mapper.Map<AttractionDto>(_atrakcjaRepository.GetAttraction(atrakcjaId));

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(atrakcja);
        }

        [HttpGet("artykul/{atrakcjaId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Attraction>))]
        [ProducesResponseType(400)]
        public IActionResult GetArtykulByAtrakcja(int atrakcjaId)
        {
            var artykuly = _mapper.Map<List<ArticleDto>>(_atrakcjaRepository.GetArticleByAttraction(atrakcjaId));

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            return Ok(artykuly);
        }

        [HttpGet("atrakcje/{artykulId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Attraction>))]
        [ProducesResponseType(400)]
        public IActionResult GetAtrakcjeArtykulu(int artykulId)
        {
            var artykuly = _atrakcjaRepository.GetArticlesAttraction(artykulId);

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            return Ok(artykuly);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateAtrakcja([FromBody] AttractionDto atrakcjaCreate)
        {
            if (atrakcjaCreate == null)
                return BadRequest(ModelState);

            var atrakcja = _atrakcjaRepository.GetAttractions().Where(c => c.Type.Trim().ToUpper() == atrakcjaCreate.Type.TrimEnd().ToUpper()).FirstOrDefault();

            if (atrakcja != null)
            {
                ModelState.AddModelError("", "Atrakcja już istnieje");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var atrakcjaMap = _mapper.Map<Attraction>(atrakcjaCreate);

            if (!_atrakcjaRepository.CreateAttraction(atrakcjaMap))
            {
                ModelState.AddModelError("", "Something went wrong while savin");
                return StatusCode(500, ModelState);
            }

            return Ok("Seccessfully created");
        }

        [HttpPut("{atrakcjaId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateAtrakcja(int atrakcjaId, [FromBody] AttractionDto updatedAtrakcja)
        {
            if (updatedAtrakcja == null)
                return BadRequest(ModelState);

            if (atrakcjaId != updatedAtrakcja.Id)
                return BadRequest(ModelState);

            if (!_atrakcjaRepository.AttractionExists(atrakcjaId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var atrakcjaMap = _mapper.Map<Attraction>(updatedAtrakcja);

            if (!_atrakcjaRepository.UpdateAttraction(atrakcjaMap))
            {
                ModelState.AddModelError("", "Something went wrong updating atrakcja");
                return StatusCode(500, ModelState);
            }
            return NoContent();
        }

        [HttpGet("atrakcje")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ArticlesAttraction>))]
        public IActionResult GetMostPopularAttractions()
        {
            var atrakcja = _atrakcjaRepository.GetMostPopularAttractions();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(atrakcja);
        }
    }
}
