using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using WebSmokingSpport.Models;
using WebSmokingSpport.DTOs;

namespace WebSmokingSpport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        QuitSmokingSupportContext DataContext;
        public UserController(QuitSmokingSupportContext DataContext_in)
        {
            DataContext = DataContext_in;
        }
        [HttpGet]
        [Route("/User/GetListUser")]
        public ActionResult GetUser()
        {
            return Ok(new {data = DataContext.Users.ToList()});
        }
        [HttpPost]
        [Route("/User/SearchUser")]
        public ActionResult SearchUser(string s)
        {
            return Ok(new { data = DataContext.Users.Where(item => item.Username.Contains(s)).ToList()});
        }
        [HttpPost]
        [Route("/User/insert")]
        public ActionResult Insert([FromBody] DTOUserForCreate obj)
        {
            try
            {
                
                var newUser = new User
                {
                    
                    Username = obj.UserName,
                    PasswordHash = obj.PasswordHash,
                    DisplayName = obj.DisplayName,
                    UserType = obj.UserType,
                    AvatarUrl = obj.AvatarUrl,
                    IsActive = obj.IsActive,
                    CreatedAt = DateTime.Now, 
                    UpdatedAt = DateTime.Now  
                };

                // Thêm entity User vào DbContext
                DataContext.Add(newUser); // Hoặc DataContext.Users.Add(newUser); nếu bạn có DbSet<User> tên là Users

                // Lưu thay đổi vào cơ sở dữ liệu
                DataContext.SaveChanges();

                // Trả về kết quả thành công, bao gồm UserId vừa được tạo
                return Ok(new { message = "Insert successful", userId = newUser.UserId });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return BadRequest(new { message = "Insert failed", error = ex.Message });
            }
        }
        [HttpPost]
        [Route("/User/UpdateUser")]
         public ActionResult Update([FromBody] DTOUserForUpdate dto)
         {
            var existingUser = DataContext.Users.Find(dto.UserId);
            if (existingUser == null)
            {
                return NotFound("Not found UserId to update");
            }
            existingUser.Username = dto.UserName;
            existingUser.PasswordHash = dto.PasswordHash;
            existingUser.DisplayName = dto.DisplayName;
            existingUser.UserType = dto.UserType;  
            existingUser.AvatarUrl = dto.AvatarUrl;
            existingUser.IsActive = dto.IsActive;
            existingUser.UpdatedAt = DateTime.Now;
           
            DataContext.SaveChanges();
            return Ok("User update successful");
         }
        [HttpPost]
        [Route("/User/Del")]
        public ActionResult Delete(int id)
        {
            User user = new User();
            user.UserId = id;

            DataContext.Remove(user);
            DataContext.SaveChanges();
            return Ok(new {data = user });
        }
    }
}
