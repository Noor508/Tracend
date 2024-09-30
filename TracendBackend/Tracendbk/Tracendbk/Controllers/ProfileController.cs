using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using Microsoft.Data.SqlClient;
using Tracendbk.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Security.Claims;

namespace Tracendbk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication for all endpoints
    public class ProfileController : ControllerBase
    {
        private readonly string _connectionString;

        public ProfileController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private int GetUserIdFromClaims()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        [HttpGet]
        [Route("GetProfile")]
        public IActionResult GetProfile()
        {
            int userId = GetUserIdFromClaims();

            if (userId == 0)
            {
                return Unauthorized("User not found.");
            }

            try
            {
                var profile = new Profile();
                using (var conn = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GetProfile", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        conn.Open();
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                profile = new Profile
                                {
                                    UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
                                    Name = reader.IsDBNull(reader.GetOrdinal("Name")) ? null : reader.GetString(reader.GetOrdinal("Name")),
                                    Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? null : reader.GetString(reader.GetOrdinal("Email")),
                                    Bio = reader.IsDBNull(reader.GetOrdinal("Bio")) ? null : reader.GetString(reader.GetOrdinal("Bio")),
                                };
                            }
                        }
                    }
                }
                return Ok(profile);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving profile: {e.Message}");
            }
        }



        [HttpPut]
        [Route("UpdateProfile")]
        public IActionResult UpdateProfile([FromForm] Profile profile)
        {
            int userId = GetUserIdFromClaims(); // Fetch the userId from claims

            if (userId == 0)
            {
                return Unauthorized(new { message = "User not found." });
            }

            if (profile == null)
            {
                return BadRequest(new { message = "Invalid profile data." });
            }

            string msg;
            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("usp_UpdateProfile", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Pass the userId parameter
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        cmd.Parameters.AddWithValue("@Name", profile.Name ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Email", profile.Email ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Bio", profile.Bio ?? (object)DBNull.Value);
                        // Ensure no parameters related to profile picture are here

                        SqlParameter returnValue = new SqlParameter
                        {
                            Direction = ParameterDirection.ReturnValue
                        };
                        cmd.Parameters.Add(returnValue);

                        conn.Open();
                        cmd.ExecuteNonQuery();

                        int result = (int)returnValue.Value;
                        msg = result == 0 ? "Profile updated successfully." : "Failed to update profile.";
                    }
                }
            }
            catch (Exception e)
            {
                msg = $"Error updating profile: {e.Message}";
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = msg });
            }

            return Ok(new { message = msg });
        }





    }
}