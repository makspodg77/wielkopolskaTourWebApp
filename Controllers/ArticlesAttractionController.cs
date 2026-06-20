using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Project1.Dto;
using Project1.Interfaces;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesAttractionController : Controller
    {
        private readonly IArticlesAttractionRepository _atrakcjeArtykuluRepository;
        private readonly IMapper _mapper;
        public ArticlesAttractionController(IArticlesAttractionRepository atrakcjeArtykuluRepository, IMapper mapper)
        {
            _atrakcjeArtykuluRepository = atrakcjeArtykuluRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult AddAtrakcjeArtykulu([FromQuery] int artykulId, [FromQuery] int atrakcjaId)
        {
            if(_atrakcjeArtykuluRepository.ArticlesAttractionExists(artykulId, atrakcjaId))
            {
                return BadRequest();
            }
            _atrakcjeArtykuluRepository.AddArticlesAttraction(artykulId, atrakcjaId);
            return Ok();
        }

        [HttpDelete]

        public IActionResult RemoveAtrakcjeArtykulu([FromQuery] int atrakcjaId, [FromQuery] int artykulId)
        {
            if (_atrakcjeArtykuluRepository.ArticlesAttractionExists(artykulId, atrakcjaId))
            {
                _atrakcjeArtykuluRepository.removeArticlesAttraction(artykulId, atrakcjaId);
                return Ok();
            }
            return BadRequest();
        }
    }
}
