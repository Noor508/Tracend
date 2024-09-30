using System.ComponentModel.DataAnnotations;

namespace Tracendbk.Models
{
    public class Profile
    {
        public int UserId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Bio { get; set; }

    }
}
