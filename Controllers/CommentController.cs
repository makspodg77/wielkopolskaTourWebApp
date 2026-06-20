using Microsoft.AspNetCore.Mvc;
using Project1.Dto;
using Project1.Interfaces;
using Project1.Models;
using Project1.Repository;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : Controller
    {
        private readonly ICommentRepository _commentRepository;
        public CommentController(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Comment>))]

        public IActionResult GetComments()
        {
            var comments = _commentRepository.GetAllComments();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(comments);
        }

        [HttpGet("{commentId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Comment>))]

        public IActionResult GetComment(int commentId)
        {
            var comment = _commentRepository.GetComment(commentId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(comment);
        }

        [HttpGet("Artykul/{articleId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<int>))]

        public IActionResult GetArticlesNumberOfComments(int articleId)
        {
            var number = _commentRepository.NumberOfArticleComments(articleId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(number);
        }

        [HttpGet("article/{articleId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Comment>))]

        public IActionResult GetArticlesComments(int articleId)
        {
            var comments = _commentRepository.GetArticlesComments(articleId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(comments);
        }
        [HttpPost]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Comment>))]

        public IActionResult AddComment([FromBody] Comment comment)
        {
            if (comment == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_commentRepository.AddComment(comment))
            {
                ModelState.AddModelError("", "Something went wrong while savin");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully added");
        }

        [HttpDelete]
        public IActionResult DeleteComment([FromQuery] int commentId)
        {
            if (_commentRepository.CommentExists(commentId))
            {
                _commentRepository.DeleteComment(commentId);
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut("AddLike/{commentId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]

        public IActionResult UpdateArtykul(int commentId, [FromBody] Comment comment)
        {
            if (comment == null)
                return BadRequest(ModelState);

            if (commentId != comment.Id)
                return BadRequest(ModelState);

            if (!_commentRepository.CommentExists(commentId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            if (!_commentRepository.LikeAComment(comment))
            {
                ModelState.AddModelError("", "Something went wrong updating owner");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
