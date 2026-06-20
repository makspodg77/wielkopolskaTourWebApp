using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.JSInterop;
using Project1.Dto;
using Project1.Interfaces;
using Project1.Models;
using Project1.Repository;
using System.Text;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : Controller
    {
        private readonly IImageRepository _imageRepository;

        public ImageController(IImageRepository imageRepository)
        {
            _imageRepository = imageRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Image>))]

        public IActionResult GetImages()
        {
            var images = _imageRepository.GetImages();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(images);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Image>))]

        public IActionResult GetImage(int id)
        {
            var images = _imageRepository.GetImage(id);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(images);
        }



        [HttpGet("artykul/{artykulId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Image>))]

        public IActionResult GetArticlesImages(int artykulId)
        {
            var image = _imageRepository.GetArticlesImages(artykulId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(image);
        }

        [HttpGet("artykul/first/{artykulId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Image>))]

        public IActionResult GetArticlesFirstImage(int artykulId)
        {
            var image = _imageRepository.GetArticlesFirstImage(artykulId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(image);
        }

        [HttpPost]

        public IActionResult AddImage([FromBody] Image image)
        {
            
            if (!_imageRepository.AddImage(image))
            {
                ModelState.AddModelError("", "Something went wrong while savin");
                return StatusCode(500, ModelState);
            }
            return Ok(image);
        }
        [HttpDelete("delete/{imageId}")]
        public IActionResult DeleteImage(int imageId)
        {
            if(!_imageRepository.DeleteImage(imageId))
            {
                ModelState.AddModelError("", "Something went wrong while deletin");
                return StatusCode(500, ModelState);
            }
            return Ok(imageId);
        }
    }
}
