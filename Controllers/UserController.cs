using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Project1.Dto;
using Project1.Interfaces;
using Project1.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private UserManager<User> _userManager;
        private IUserRepository _userRepository;
        private IMapper _mapper;
        public UserController(UserManager<User> userManager, IUserRepository userRepository, IMapper mapper)
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<object> PostApplicationUser(UserRegistrationModel model)
        {
            model.Role = "User";
            var applicationUser = new User()
            {
                UserName = model.Login,
                FullName = model.FullName
            };

            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                await _userManager.AddToRoleAsync(applicationUser, model.Role);
                return Ok(result);
            }
            catch (Exception)
            {
                throw;
            }
        }
        [HttpPost]
        [Route("Reset")]
        public async Task<IActionResult> ResetPassword([FromBody] changePassword obj)
        {
            var user = _userManager.FindByIdAsync(obj.id).Result;
            if (obj == null || !await _userManager.CheckPasswordAsync(user, obj.oldPassword))
                return BadRequest();

            if (obj.newPassword != obj.rePassword)
                return BadRequest();

            var token = _userManager.GeneratePasswordResetTokenAsync(user).Result;
            var result = await _userManager.ResetPasswordAsync(user, token, obj.newPassword);
            return Ok(result);
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(UserLoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var role = await _userManager.GetRolesAsync(user);
                IdentityOptions _options = new IdentityOptions();

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID", user.Id.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType, role.FirstOrDefault())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes("1234567890123456")), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new { token });
            }
            else
                return BadRequest();
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _userRepository.GetUsers();
            var users2 = _mapper.Map<UserDto[]>(users);
            foreach (var user in users2)
            {
                if (user != null)
                {
                    user.Rank = _userRepository.GetUserRole(user.Id);
                }
            }
            return Ok(users2);
        }

        [HttpGet]
        [Route("Ranks")]

        public IActionResult GetRanks()
        {
            return Ok(_userRepository.GetAllRanks());
        }

        [HttpPut]
        [Route("Ranks")]

        public IActionResult PutUserRole(Role role)
        {
            return Ok(_userRepository.putUserRole(role));
        }

        [HttpDelete]
        [Route("{userId}")]
        public IActionResult DeleteUser(string userId)
        {
            return Ok(_userRepository.deleteUser(userId));
        }

        [HttpGet]
        [Route("NumberOfArticlesByUser/{userId}")]

        public IActionResult NumberOfArticlesByUser(string userId)
        {
            return Ok(_userRepository.NumberOfArticlesByUser(userId));
        }

        [HttpGet]
        [Route("NumberOfCommentsByUser/{userId}")]

        public IActionResult NumberOfCommentsByUser(string userId)
        {
            return Ok(_userRepository.NumberOfCommentsByUser(userId));
        }

        [HttpGet]
        [Route("NumberOfLikedArticlesByUser/{userId}")]

        public IActionResult NumberOfLikedArticlesByUser(string userId)
        {
            return Ok(_userRepository.NumberOfLikedArticlesByUser(userId));
        }
    }
}
