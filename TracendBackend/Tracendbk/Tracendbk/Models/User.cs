using System.ComponentModel.DataAnnotations;

namespace Tracendbk.Models
{
    public class User
    {

        public int Id { get; set; }


        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(255)]
        public string Password { get; set; }



    }
}