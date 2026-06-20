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
    public class LikeController : Controller
    {
        private readonly ILikeRepository _likeRepository;
        public LikeController(ILikeRepository likeRepository)
        {
            _likeRepository = likeRepository;
        }

        [HttpGet("article/{articleId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<int>))]

        public IActionResult GetNumberOfArticleLikes(int articleId)
        {
            var likes = _likeRepository.GetNumberOfArticleLikes(articleId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(likes);
        }
        [HttpGet("article")]
        public IActionResult likeExists([FromQuery] int articleId, [FromQuery] Guid userId)
        {
            if (_likeRepository.likeExists(userId, articleId))
                return Ok(false);

            return Ok(true);

        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]

        public IActionResult AddLike([FromQuery] int articleId, [FromQuery] Guid userId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if(_likeRepository.likeExists(userId, articleId))
                return BadRequest(ModelState);

            if (!_likeRepository.AddLike(articleId, userId))
            {
                ModelState.AddModelError("", "Something went wrong while savin");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully added");
        }
    }
}
