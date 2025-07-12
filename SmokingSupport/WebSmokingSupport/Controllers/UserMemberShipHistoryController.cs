using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Data;
using WebSmokingSupport.DTOs;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Numerics;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMemberShipHistoryController : ControllerBase
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<UserMembershipHistory> _userMembershipHistoryRepository;
        public UserMemberShipHistoryController(QuitSmokingSupportContext context , IGenericRepository<UserMembershipHistory> userMembershipHistoryRepository)
        {
            _context = context;
            _userMembershipHistoryRepository = userMembershipHistoryRepository;
        }
        [HttpGet]
        [Authorize(Roles = "Coach, Admin")]
        public async Task<ActionResult<IEnumerable<DTOUserMemberShipHistoryForRead>>> GetAllUserMemberShipHistory()
        {
            try
            {
                var currentUserIdClams = User.FindFirst(ClaimTypes.NameIdentifier);
                int currentUserId = int.Parse(currentUserIdClams.Value);
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

                IQueryable<UserMembershipHistory> query = _context.UserMembershipHistories
                                                                  .Include(umh => umh.Plan)
                                                                  .Include(umh => umh.User);

               
                if (currentUserRole == "Member")
                {
                    query = query.Where(umh => umh.UserId == currentUserId);
                }
                var userMembershipHistories = await query.ToListAsync();


                var userMembershipHistoryResponses = userMembershipHistories.Select(umh => new DTOUserMemberShipHistoryForRead
                {
                    HistoryId = umh.HistoryId,
                    UserId = umh.UserId,
                    PlanId = umh.PlanId ?? 0,
                    StartDate = umh.StartDate,
                    EndDate = umh.EndDate,
                    UserName = umh.User?.DisplayName ?? "Unknown User",
                    PlanName = umh.Plan?.Name ?? "Plan deleted",
                    Price = umh.Plan?.Price ?? 0m, 
                }).ToList();

                return Ok(userMembershipHistoryResponses);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
             
                return StatusCode(500, $"Lỗi nội bộ máy chủ khi lấy lịch sử đăng ký thành viên: {ex.Message}");
            }
        }
        [HttpGet("my-history")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<IEnumerable<DTOUserMemberShipHistoryForRead>>> GetMyUserMemberShipHistory()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }
            int userId = int.Parse(userIdClaim.Value);
            var userMembershipHistories = await _context
                .UserMembershipHistories

                .Include(umh => umh.Plan)

                .Include(umh => umh.User)

                .Where(umh => umh.UserId == userId)

                .ToListAsync();

            var userMembershipHistoryResponses = userMembershipHistories.Select(umh => new DTOUserMemberShipHistoryForRead
            {
                HistoryId = umh.HistoryId,
                UserId = umh.UserId,
                PlanId = umh.PlanId ?? 0,
                StartDate = umh.StartDate,
                EndDate = umh.EndDate,
                UserName = umh.User?.DisplayName ?? "Unknown User",
                PlanName = umh.Plan?.Name ?? "Plan deleted",
                Price = umh.Plan?.Price ?? 0m,
            }).ToList();
            return Ok(userMembershipHistoryResponses);
        }
    }
}
