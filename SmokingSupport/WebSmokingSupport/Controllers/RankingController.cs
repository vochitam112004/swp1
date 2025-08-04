using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.DTOs;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RankingController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<Ranking> _rankingRepository;
        public RankingController(QuitSmokingSupportContext context, IGenericRepository<Ranking> rankingRepository)
        {
            _context = context;
            _rankingRepository = rankingRepository;
        }
    }
}
