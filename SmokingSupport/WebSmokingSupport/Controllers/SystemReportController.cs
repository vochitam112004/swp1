using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Entity;
using WebSmokingSupport.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using WebSmokingSupport.Data;
using Microsoft.EntityFrameworkCore;
namespace WebSmokingSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemReportController : ControllerBase
    {
        private readonly IGenericRepository<SystemReport> _systemReportRepository;
        private readonly QuitSmokingSupportContext _context;
        public SystemReportController(IGenericRepository<SystemReport> systemReportRepository , QuitSmokingSupportContext context)
        {
            _systemReportRepository = systemReportRepository;
            _context = context;
        }
        [HttpGet]
        [Authorize(Roles = "Member, Coach, Admin")]
        public async Task<ActionResult<IEnumerable<DTOSystemReportForRead>>> GetAllSystemReports()
        {
            var systemReports = await _systemReportRepository.GetAllAsync();
            if (systemReports == null || !systemReports.Any())
            {
                return NotFound("No system reports found.");
            }
            var systemReported = await _context.SystemReports
                        .Include(sr => sr.Reporter)
                        .ToListAsync();

            var systemReportResponse = systemReports.Select(sr => new DTOSystemReportForRead
            {
                ReportId = sr.ReportId,
                ReporterId = sr.ReporterId,
                ReportType = sr.ReportType,
                Details = sr.Details,
                ReportedAt = sr.ReportedAt,
                NameReporter = sr.Reporter?.DisplayName,
            }).ToList();
            return Ok(systemReportResponse);
        }
        [HttpPost]
        [Authorize(Roles = "Member, Coach")]
        public async Task<ActionResult<DTOSystemReportForCreate>> CreateSystemReport([FromBody] DTOSystemReportForCreate dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid report data.");
            }
            var userIdClamis = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClamis == null)
            {
                return Unauthorized("User not authenticated.");
            }
            int userId = int.Parse(userIdClamis);
            var SystemReprot = await _systemReportRepository.GetAllAsync();
            var existingReport = SystemReprot.FirstOrDefault(sr => sr.ReporterId == userId && sr.ReportType == dto.ReportType && sr.Details == dto.Details);
            if (existingReport != null)
            {
                return BadRequest("You have already reported this issue.");
            }
            var newReport = new SystemReport
            {
                ReporterId = userId,
                ReportType = dto.ReportType,
                Details = dto.Details,
                ReportedAt = DateTime.UtcNow
            };
            await _systemReportRepository.CreateAsync(newReport);
            var existingReportUser = await _systemReportRepository.GetByIdAsync(userId);
            var reportResponse = new DTOSystemReportForRead
            {
                ReportId = newReport.ReportId,
                ReporterId = newReport.ReporterId,
                ReportType = newReport.ReportType,
                Details = newReport.Details,
                ReportedAt = newReport.ReportedAt,
                NameReporter = existingReportUser?.Reporter?.DisplayName ?? "Unknown User",
            };
            return CreatedAtAction(nameof(GetAllSystemReports), new { id = reportResponse.ReportId }, reportResponse);
        }
        [HttpPut("{ReportId}")]
        [Authorize(Roles = "Member, Coach")]
        public async Task<ActionResult<DTOSystemReportForRead>> UpdateSystemReport(int ReportId, [FromBody] DTOSystemReportForUpdate dto)
        {
            if (dto == null || ReportId <= 0)
            {
                return BadRequest("Invalid report data.");
            }
            var systemReport = await _systemReportRepository.GetByIdAsync(ReportId);
            if (systemReport == null)
            {
                return NotFound($"System report with ID {ReportId} not found.");
            }
            if(!string.IsNullOrWhiteSpace(dto.Details))
            {
                systemReport.Details = dto.Details;
            }
            if (dto.ReportType != null)
            {
                systemReport.ReportType = dto.ReportType;
            }
            systemReport.ReportedAt = DateTime.UtcNow;
            await _systemReportRepository.UpdateAsync(systemReport);
            var reportResponse = new DTOSystemReportForRead
            {
                ReportId = systemReport.ReportId,
                ReporterId = systemReport.ReporterId,
                ReportType = systemReport.ReportType,
                Details = systemReport.Details,
                ReportedAt = systemReport.ReportedAt,
                NameReporter = systemReport.Reporter?.Username
            };
            return Ok(reportResponse);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteSystemReport(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid report ID.");
            }
            var systemReport = await _systemReportRepository.GetByIdAsync(id);
            if (systemReport == null)
            {
                return NotFound($"System report with ID {id} not found.");
            }
            await _systemReportRepository.RemoveAsync(systemReport);
            return NoContent();
        }
    }
}
