using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Project1.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }        
        public int AccountLevel { get; set; }

    }
}
