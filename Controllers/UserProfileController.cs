using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Project1.Interfaces;
using Project1.Models;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private UserManager<User>  _userManager;
        private readonly IUserRepository _userRepository;
        public UserProfileController(UserManager<User> userManager, IUserRepository userRepository)
        {
            _userManager = userManager;
            _userRepository = userRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<object> GetUserProfile()
        {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                if (userId == null) return null;
                var user = await _userManager.FindByIdAsync(userId);
                return new
                {
                    user.FullName,
                    user.UserName
                };
        }

        [HttpGet]
        [Authorize]
        [Route("userId")]
        public async Task<object> GetUserId()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return new
            {
                user.Id
            };
        }

        [HttpGet]
        [Authorize]
        [Route("userData")]

        public async Task<object> GetUserData()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            var userRole = _userRepository.GetUserRole(userId);
            return new
            {
                id = user.Id,
                login = user.UserName,
                nickname = user.FullName,
                role = userRole
            };
        }
    }
}
