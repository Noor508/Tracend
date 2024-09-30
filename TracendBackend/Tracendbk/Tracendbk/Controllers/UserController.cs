using Google.Apis.Auth;

using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Mvc;

using Microsoft.Data.SqlClient;

using Microsoft.Extensions.Configuration;

using Microsoft.IdentityModel.Tokens;

using System;

using System.Collections.Generic; // For Dictionary

using System.Data;

using System.IdentityModel.Tokens.Jwt;

using System.Linq; // For LINQ methods

using System.Net.Mail;

using System.Net;

using System.Security.Claims;

using System.Text;

using System.Threading.Tasks;

using Tracendbk.Models;

using Tracendbk.Services; // For sending emails



namespace Tracendbk.Controllers

{

    [Route("api/[controller]")]

    [ApiController]

    public class UserController : ControllerBase

    {

        private readonly string _connectionString;

        private readonly IConfiguration _configuration;



        // Temporary storage for codes and expiration

        private static readonly Dictionary<string, string> _codeStore = new Dictionary<string, string>();

        private static readonly Dictionary<string, DateTime> _codeExpiryStore = new Dictionary<string, DateTime>();



        public UserController(IConfiguration configuration, IEmailService emailService)

        {

            _connectionString = configuration.GetConnectionString("DefaultConnection");

            _configuration = configuration;

        }



        private bool IsValidPassword(string password)

        {

            // Check for minimum length

            if (password.Length < 8)

                return false;



            // Check for at least one uppercase letter

            if (!password.Any(char.IsUpper))

                return false;



            // Check for at least one numeric character

            if (!password.Any(char.IsDigit))

                return false;



            return true;

        }



        [HttpPost]

        [Route("Register")]

        public async Task<IActionResult> RegisterAsync([FromBody] User usr)

        {

            if (usr == null)

            {

                return BadRequest("Invalid user data.");

            }



            // Validate password strength

            if (!IsValidPassword(usr.Password))

            {

                return BadRequest("Password must be at least 8 characters long, contain at least one uppercase letter and one numeric character.");

            }



            try

            {

                using (var conn = new SqlConnection(_connectionString))

                {

                    await conn.OpenAsync();



                    using (SqlCommand checkUserCmd = new SqlCommand("usp_CheckUserExists", conn))

                    {

                        checkUserCmd.CommandType = CommandType.StoredProcedure;

                        checkUserCmd.Parameters.AddWithValue("@Email", usr.Email);



                        var exists = await checkUserCmd.ExecuteScalarAsync();

                        if (exists != null && (int)exists > 0)

                        {

                            return BadRequest("Email already in use.");

                        }

                    }



                    using (SqlCommand cmd = new SqlCommand("usp_Register", conn))

                    {

                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Name", usr.Name);

                        cmd.Parameters.AddWithValue("@Email", usr.Email);

                        cmd.Parameters.AddWithValue("@Password", usr.Password);



                        int rowsAffected = await cmd.ExecuteNonQueryAsync();

                        if (rowsAffected > 0)

                        {

                            return Ok(new { message = "User registered successfully." });

                        }

                        else

                        {

                            return StatusCode(StatusCodes.Status500InternalServerError, "User registration failed.");

                        }

                    }

                }

            }

            catch (Exception e)

            {

                return StatusCode(StatusCodes.Status500InternalServerError, $"Error in Register: {e.Message}");

            }

        }



        [HttpPost]

        [Route("Login")]

        public async Task<IActionResult> Login([FromBody] LoginModel login)

        {

            if (login == null)

            {

                return BadRequest("Invalid login data.");

            }



            try

            {

                using (var conn = new SqlConnection(_connectionString))

                {

                    await conn.OpenAsync();



                    using (SqlCommand cmd = new SqlCommand("usp_login", conn))

                    {

                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Email", login.Email);

                        cmd.Parameters.AddWithValue("@Password", login.Password);



                        var userId = await cmd.ExecuteScalarAsync(); // Assuming this returns the user ID



                        if (userId == null)

                        {

                            return Unauthorized("Invalid credentials.");

                        }



                        // Ensure userId is converted to an int

                        if (!int.TryParse(userId.ToString(), out int parsedUserId))

                        {

                            return StatusCode(StatusCodes.Status500InternalServerError, "User ID conversion failed.");

                        }



                        // Generate JWT token with user ID

                        var token = GenerateJwtToken(parsedUserId);

                        return Ok(new { Token = token });

                    }

                }

            }

            catch (Exception e)

            {

                return StatusCode(StatusCodes.Status500InternalServerError, $"Error during login: {e.Message}");

            }

        }



        private string GenerateJwtToken(int userId)

        {

            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);



            if (key.Length == 0)

            {

                throw new InvalidOperationException("JWT secret is not configured or is empty.");

            }



            var tokenDescriptor = new SecurityTokenDescriptor

            {

                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) }),

                Expires = DateTime.UtcNow.AddHours(1),

                Issuer = _configuration["Jwt:Issuer"],

                Audience = _configuration["Jwt:Audience"],

                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)

            };



            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

        }
        [HttpPost]
        [Route("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    // Check if user exists
                    using (var checkUserCmd = new SqlCommand("SELECT UserId, Name FROM tblUsers WHERE Email = @Email", conn))
                    {
                        checkUserCmd.Parameters.AddWithValue("@Email", email);
                        using (var reader = await checkUserCmd.ExecuteReaderAsync())
                        {
                            if (!reader.Read())
                            {
                                return NotFound("This email address does not exist in our database.");
                            }

                            int userId = reader.GetInt32(0);
                            string fullName = reader.GetString(1);
                            var guid = Guid.NewGuid();
                            var resetCode = GenerateRandomCode(); // Generate a random reset code

                            // Insert the reset request into tblForgotPasswordRequest1
                            using (SqlCommand cmd = new SqlCommand("INSERT INTO tblForgotPasswordRequest1 (Email, ResetCode, DateRequested) VALUES (@Email, @ResetCode, @DateRequested)", conn))
                            {
                                cmd.Parameters.AddWithValue("@Email", email); // Store the email
                                cmd.Parameters.AddWithValue("@ResetCode", resetCode); // Store the reset code
                                cmd.Parameters.AddWithValue("@DateRequested", DateTime.Now); // Current timestamp

                                await cmd.ExecuteNonQueryAsync();
                            }

                            // Prepare email content
                            string emailSubject = "Reset Password";
                            string emailBody = $"Hi {fullName},<br/>Your password reset code is: <strong>{resetCode}</strong><br/>" +
                                               $"This code is valid for 10 minutes.";
                            await SendEmailAsync(email, emailSubject, emailBody);

                            return Ok("Password reset code has been sent to your email.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error during password reset: {ex.Message}");
            }
        }


        [HttpPost]
        [Route("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model, [FromQuery] string email, [FromQuery] string enteredCode)
        {
            if (model == null || string.IsNullOrEmpty(model.NewPassword) || string.IsNullOrEmpty(model.ConfirmPassword))
            {
                return BadRequest("New password and confirmation are required.");
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }

            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("usp_ResetPassword", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Email", email);
                        cmd.Parameters.AddWithValue("@ResetCode", enteredCode);
                        cmd.Parameters.AddWithValue("@NewPassword", model.NewPassword); // Make sure to hash this password

                        var result = await cmd.ExecuteScalarAsync();

                        if (result == null)
                        {
                            return NotFound("Invalid reset attempt.");
                        }

                        return Ok("Password has been successfully updated.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error during password reset: {ex.Message}");
            }
        }


        // Helper method to send emails

        private async Task SendEmailAsync(string toEmail, string subject, string body)

        {

            using (var message = new MailMessage("your_email@gmail.com", toEmail))

            {

                message.Subject = subject;

                message.Body = body;

                message.IsBodyHtml = true;



                using (var smtp = new SmtpClient("smtp.gmail.com", 587))

                {

                    smtp.Credentials = new NetworkCredential("ainaa0018@gmail.com", "unjm bwdr zvbp ofxn"); // Use app password for better security

                    smtp.EnableSsl = true;

                    await smtp.SendMailAsync(message);

                }

            }

        }


        private string GenerateRandomCode(int length = 6)

        {

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            var random = new Random();

            return new string(Enumerable.Repeat(chars, length)

                .Select(s => s[random.Next(s.Length)]).ToArray());

        }


    }

}
