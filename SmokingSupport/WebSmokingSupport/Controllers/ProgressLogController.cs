//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using WebSmokingSupport.Data;
//using WebSmokingSupport.Interfaces;
//using WebSmokingSupport.Entity;
//using System.Security.Claims;
//using Microsoft.AspNetCore.Authorization;
//using WebSmokingSpport.DTOs;
//namespace WebSmokingSupport.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class ProgressLogController : ControllerBase
//    {
//        private readonly QuitSmokingSupportContext _context;
//        private readonly IGenericRepository<ProgressLog> _progressLogRepository;
//        public ProgressLogController(QuitSmokingSupportContext context, IGenericRepository<ProgressLog> progressLogRepository)
//        {
//            _context = context;
//            _progressLogRepository = progressLogRepository;
//        }
//        [HttpGet("GetAllProgressLog")]
//        [Authorize(Roles = "Member ,Coach")]
//        public async Task<ActionResult<DTOProgressLogForRead>> GetAllProgressLog()
//        {

//        }
//    }
//}
