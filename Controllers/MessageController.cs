using Microsoft.AspNetCore.Mvc;
using Project1.Interfaces;
using Project1.Models;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : Controller
    {
        private readonly IMessageRepository _messageRepository;

        public MessageController(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        [HttpGet]
        public IActionResult GetMessages() 
        {
            ICollection<Message> messages = _messageRepository.getMessages();
            return Ok(messages);
        }

        [HttpPost]
        public IActionResult PostMessage(Message message) 
        {
            if (!_messageRepository.addMessage(message))
            {
                ModelState.AddModelError("", "Something went wrong while savin");
                return StatusCode(500, ModelState);
            }
            return Ok(message);
        }

        [HttpDelete]
        [Route("{messageId}")]
        public IActionResult DeleteMessages(int messageId) 
        {
            var message = _messageRepository.GetMessage(messageId);
            if (message != null)
            {
                _messageRepository.removeMessage(message);
                return Ok();
            }
            return BadRequest();
        }
    }
}
