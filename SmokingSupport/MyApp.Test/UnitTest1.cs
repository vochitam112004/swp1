using Xunit;
using Moq;
using WebSmokingSupport.Controllers;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Repositories;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Service;
using WebSmokingSupport.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebSmokingSupport.Data;
using System;
using Azure;
using System.Text.Json;

namespace WebSmokingSupport.Tests
{
    public class AuthControllerTests
    {
        private AuthController CreateControllerWithMocks(
            out Mock<IUserRepository> userRepoMock,
            out Mock<IJwtService> jwtMock,
            out Mock<IGenericRepository<User>> genericUserRepoMock,
            out Mock<IGenericRepository<PasswordResetToken>> passwordResetTokenRepoMock,
            out Mock<IEmailService> emailServiceMock,
            out Mock<QuitSmokingSupportContext> contextMock
        )
        {
            userRepoMock = new Mock<IUserRepository>();
            jwtMock = new Mock<IJwtService>();
            genericUserRepoMock = new Mock<IGenericRepository<User>>();
            passwordResetTokenRepoMock = new Mock<IGenericRepository<PasswordResetToken>>();
            emailServiceMock = new Mock<IEmailService>();
            contextMock = new Mock<QuitSmokingSupportContext>();

            return new AuthController(
                genericUserRepoMock.Object,
                passwordResetTokenRepoMock.Object,
                userRepoMock.Object,
                emailServiceMock.Object,
                jwtMock.Object, 
                contextMock.Object
            );
        }

        [Fact]
        public async Task Login_MissingUsernameOrPassword_ReturnsBadRequest()
        {
            var controller = CreateControllerWithMocks(
                out _, out _, out _, out _, out _, out _);

            var dto = new DTOLoginForUserName { Username = "", Password = "" };
            var result = await controller.Login(dto);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Username and password are required.", badRequestResult.Value);
        }

        [Fact]
        public async Task Login_InvalidUsername_ReturnsUnauthorized()
        {
            var controller = CreateControllerWithMocks(
                out var userRepoMock, out _, out _, out _, out _, out _);

            userRepoMock.Setup(r => r.GetByUsernameAsync("notfound"))
                        .ReturnsAsync((User)null);

            var dto = new DTOLoginForUserName { Username = "notfound", Password = "pass" };
            var result = await controller.Login(dto);

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid username or password.", unauthorized.Value);
        }

        [Fact]
        public async Task Login_InvalidPassword_ReturnsUnauthorized()
        {
            var user = new User
            {
                Username = "trang",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("correctpass")
            };

            var controller = CreateControllerWithMocks(
                out var userRepoMock, out _, out _, out _, out _, out _);

            userRepoMock.Setup(r => r.GetByUsernameAsync("trang")).ReturnsAsync(user);

            var dto = new DTOLoginForUserName { Username = "trang", Password = "wrongpass" };
            var result = await controller.Login(dto);

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid username or password.", unauthorized.Value);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOkWithToken()
        {
            var user = new User
            {
                UserId = 1,
                Username = "trang",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("mypassword"),
                Email = "trang@example.com",
                UserType = "member"
            };

            var controller = CreateControllerWithMocks(
                out var userRepoMock, out var jwtMock, out _, out _, out _, out _);

            userRepoMock.Setup(r => r.GetByUsernameAsync("trang")).ReturnsAsync(user);
            jwtMock.Setup(j => j.GenerateToken(It.IsAny<User>())).Returns("fake-jwt-token");

            var dto = new DTOLoginForUserName { Username = "trang", Password = "mypassword" };
            var result = await controller.Login(dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
        
            var json = JsonSerializer.Serialize(okResult.Value);
            var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            Assert.Equal("Login successful", root.GetProperty("message").GetString());
            Assert.Equal("fake-jwt-token", root.GetProperty("token").GetString());
        }
        [Theory]
        [InlineData("admin", "12345", false)]
        [InlineData("admin", "wrongpass", false)]
        [InlineData("user", "123456", false)]
        public void Login_TestMultipleCases(string username, string password, bool expectedResult)
        {
            var controller = CreateControllerWithMocks(
                out var userRepoMock, out var jwtMock, out _, out _, out _, out _);

            User? user = null;
            if (username == "admin")
            {
                user = new User
                {
                    Username = username,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
                };
            }
            userRepoMock.Setup(r => r.GetByUsernameAsync(username)).ReturnsAsync(user);

            jwtMock.Setup(j => j.GenerateToken(It.IsAny<User>())).Returns("fake-jwt-token");

            var dto = new DTOLoginForUserName { Username = username, Password = password };
            var result = controller.Login(dto).Result;

            var isSuccess = result is OkObjectResult;
            Assert.Equal(expectedResult, isSuccess);
        }
    }
}
