using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMyFlight.Backend.Entities
{
    [Table("user")]
    public class User
    {
        [Key]
        [Column("user_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Column("username")]
        public string Username { get; set; }

        [Column("user_fullname")]
        public string Fname { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("phone")]
        public string Phone { get; set; }

        [Column("isadmin")]
        public int Isadmin { get; set; }

        [Column("password")]
        public string Password { get; set; }
    }
}
