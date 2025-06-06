using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSpport.Models;

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
        [Route("/user/SearchUser")]
        public ActionResult SearchUser(string s)
        {
            return Ok(new { data = DataContext.Users.Where(item => item.Username.Contains(s)).ToList()});
        }
        [HttpPost]
        [Route("/User/insert")]
        public ActionResult Insert(User obj)
        {
            DataContext.Add(obj);
            DataContext.SaveChanges();
            return Ok(new { data = obj });
        }
        [HttpPost]
    }
}
