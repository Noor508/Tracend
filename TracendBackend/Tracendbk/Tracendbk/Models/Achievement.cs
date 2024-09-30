namespace Tracendbk.Models
{
    public class Achievement
    {
        public int AchievementId { get; set; } // Add this line
        public int UserId { get; set; } // foreignkey

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Impact { get; set; }
        public string Keywords { get; set; }
    }
}
