using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMyFlight.Backend.Entities
{
    [Table("audit_log")]
    public class AuditLog
    {
        [Key]
        [Column("log_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LogId { get; set; }

        [Column("admin_id")]
        public int AdminId { get; set; }

        [Column("action")]
        public string Action { get; set; }

        [Column("details")]
        public string Details { get; set; }

        [Column("timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [Column("ip_address")]
        public string IpAddress { get; set; }
    }
}
