using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Tracendbk.Models;
using System.Drawing;

namespace Tracendbk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Securing the entire controller
    public class AchievementsController : ControllerBase
    {
        private readonly string _connectionString;

        public AchievementsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        [Route("GetUserAchievements")]
        public IActionResult GetUserAchievements()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User not found in the token.");
                }

                int userId = int.Parse(userIdClaim.Value);
                var achievements = new List<Achievement>();

                using (var conn = new SqlConnection(_connectionString))
                {
                    using (var cmd = new SqlCommand("usp_GetUserAchievements", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        conn.Open();

                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                achievements.Add(new Achievement
                                {
                                    AchievementId = reader.GetInt32(reader.GetOrdinal("AchievementId")),
                                    StartDate = reader.IsDBNull(reader.GetOrdinal("StartDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                    EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                    Title = reader.IsDBNull(reader.GetOrdinal("Title")) ? null : reader.GetString(reader.GetOrdinal("Title")),
                                    Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                    Impact = reader.IsDBNull(reader.GetOrdinal("Impact")) ? null : reader.GetString(reader.GetOrdinal("Impact")),
                                    Keywords = reader.IsDBNull(reader.GetOrdinal("Keywords")) ? null : reader.GetString(reader.GetOrdinal("Keywords")),
                                });
                            }
                        }
                    }
                }

                return Ok(achievements);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving user's achievements: {e.Message}");
            }
        }

        [HttpPut]
        [Route("Update/{id}")]
        public IActionResult UpdateAchievement(int id, [FromBody] Achievement achievement)
        {
            if (achievement == null)
            {
                return BadRequest("Invalid achievement data.");
            }

            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User not found in the token.");
                }

                using (var conn = new SqlConnection(_connectionString))
                {
                    using (var cmd = new SqlCommand("usp_UpdateAchievement", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@AchievementId", id);
                        cmd.Parameters.AddWithValue("@StartDate", achievement.StartDate ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@EndDate", achievement.EndDate ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Title", achievement.Title ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Description", achievement.Description ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Impact", achievement.Impact ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Keywords", achievement.Keywords ?? (object)DBNull.Value);

                        conn.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();
                        return rowsAffected > 0 ? Ok("Achievement updated successfully.") : NotFound("Achievement not found.");
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error updating achievement: {e.Message}");
            }
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public IActionResult DeleteAchievement(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User not found in the token.");
                }
                using (var conn = new SqlConnection(_connectionString))
                {
                    using (var cmd = new SqlCommand("usp_DeleteAchievement", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@AchievementId", id);
                        // Add a return parameter to capture the stored procedure's return value
                        var returnParameter = cmd.Parameters.Add("@ReturnVal", SqlDbType.Int);
                        returnParameter.Direction = ParameterDirection.ReturnValue;
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        int result = (int)returnParameter.Value;

                        // Check the return value from the stored procedure
                        if (result == 1)
                        {
                            return Ok("Achievement deleted successfully.");
                        }
                        else
                        {
                            return NotFound("Achievement not found."); // This now aligns with the stored procedure logic
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting achievement: {e.Message}");
            }
        }



        [HttpGet]
        [Route("AchievementbyId/{id}")]
        public IActionResult GetAchievementById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid achievement ID.");
            }

            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User not found in the token.");
                }

                string userId = userIdClaim.Value;  // Keep as string

                using (var conn = new SqlConnection(_connectionString))
                {
                    using (var cmd = new SqlCommand("usp_GetAchievementById", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@AchievementId", id);
                        cmd.Parameters.AddWithValue("@UserId", userId);  // Ensure the achievement belongs to the user

                        conn.Open();

                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var achievement = new
                                {
                                    AchievementId = reader["AchievementId"],
                                    StartDate = reader.IsDBNull(reader.GetOrdinal("StartDate")) ? null : reader.GetDateTime(reader.GetOrdinal("StartDate")).ToString(),
                                    EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate")) ? null : reader.GetDateTime(reader.GetOrdinal("EndDate")).ToString(),
                                    Title = reader.IsDBNull(reader.GetOrdinal("Title")) ? null : reader.GetString(reader.GetOrdinal("Title")),
                                    Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                    Impact = reader.IsDBNull(reader.GetOrdinal("Impact")) ? null : reader.GetString(reader.GetOrdinal("Impact")),
                                    Keywords = reader.IsDBNull(reader.GetOrdinal("Keywords")) ? null : reader.GetString(reader.GetOrdinal("Keywords"))
                                };

                                return Ok(achievement);  // Return the achievement if found
                            }
                            else
                            {
                                return NotFound("Achievement not found.");
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error in GetAchievementById: {e.Message} - Stack Trace: {e.StackTrace}");
            }
        }


        [HttpPost]
        [Route("Add")]
        public IActionResult AddAchievement([FromBody] Achievement achievement)
        {
            if (achievement == null)
            {
                return BadRequest("Invalid achievement data.");
            }

            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User not found in the token.");
                }

                achievement.UserId = int.Parse(userIdClaim.Value); // Ensure UserId is set from token

                using (var conn = new SqlConnection(_connectionString))
                {
                    using (var cmd = new SqlCommand("usp_InsertAchievement", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@StartDate", achievement.StartDate ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@EndDate", achievement.EndDate ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Title", achievement.Title ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Description", achievement.Description ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Impact", achievement.Impact ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Keywords", achievement.Keywords ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@UserId", achievement.UserId); // Use UserId from token

                        conn.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();
                        return rowsAffected > 0 ? Ok("Achievement added successfully.") : StatusCode(StatusCodes.Status500InternalServerError, "Failed to add achievement.");
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding achievement: {e.Message}");
            }
        }

        [HttpGet]
        [Route("Search")]
        public IActionResult SearchAchievements(string keyword)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("User not found in the token.");
                }

                int userId = int.Parse(userIdClaim.Value);
                var achievements = new List<Achievement>();

                using (var conn = new SqlConnection(_connectionString))
                {
                    using (var cmd = new SqlCommand("usp_SearchAchievementsByKeyword", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        cmd.Parameters.AddWithValue("@Keyword", keyword ?? (object)DBNull.Value);

                        conn.Open();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                achievements.Add(new Achievement
                                {
                                    AchievementId = reader.GetInt32(reader.GetOrdinal("AchievementId")),
                                    StartDate = reader.IsDBNull(reader.GetOrdinal("StartDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                    EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                    Title = reader.IsDBNull(reader.GetOrdinal("Title")) ? null : reader.GetString(reader.GetOrdinal("Title")),
                                    Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                    Impact = reader.IsDBNull(reader.GetOrdinal("Impact")) ? null : reader.GetString(reader.GetOrdinal("Impact")),
                                    Keywords = reader.IsDBNull(reader.GetOrdinal("Keywords")) ? null : reader.GetString(reader.GetOrdinal("Keywords")),
                                });
                            }
                        }
                    }
                }

                return Ok(achievements);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error searching achievements: {e.Message}");
            }
        }

    }
}
