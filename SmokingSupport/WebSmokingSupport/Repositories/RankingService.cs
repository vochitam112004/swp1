using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Controllers;
using WebSmokingSupport.Data;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
namespace WebSmokingSupport.Repositories
{
    public class RankingService : IRankingService
    {
        private readonly QuitSmokingSupportContext _context;
        private readonly IGenericRepository<Ranking> _rankingRepository;
        private readonly IGenericRepository<UserBadge> _userBadgeRepository;
        private readonly IGenericRepository<Badge> _badgeRepository; 

        public RankingService(
            QuitSmokingSupportContext context,
            IGenericRepository<Ranking> rankingRepository,
            IGenericRepository<UserBadge> userBadgeRepository,
            IGenericRepository<Badge> badgeRepository) 
        {
            _context = context;
            _rankingRepository = rankingRepository;
            _userBadgeRepository = userBadgeRepository;
            _badgeRepository = badgeRepository;
        }

        public async Task UpdateUserScoreAndBadges(int userId, int smokeFreeDays)
        {
            // tinh diem 
            int calculatedScore = CalculateScore(smokeFreeDays);

            var ranking = await _context.Rankings.FirstOrDefaultAsync(r => r.UserId == userId);
            if (ranking == null)
            {
                ranking = new Ranking
                {
                    UserId = userId,
                    Score = calculatedScore,
                    LastUpdated = DateTime.UtcNow
                };
                await _rankingRepository.CreateAsync(ranking);
            }
            else
            {
                if (calculatedScore > ranking.Score)
                {
                    ranking.Score = calculatedScore;
                    ranking.LastUpdated = DateTime.UtcNow;
                    await _rankingRepository.UpdateAsync(ranking);
                }
            }

            // --- 2. Kiểm tra và cấp huy hiệu ---
            await CheckAndAwardBadges(userId, ranking?.Score ?? 0);
        }

        private int CalculateScore(int smokeFreeDays)
        {
            int score = smokeFreeDays * 10; //mỗi ngày không hút thuốc được 10d

           
            if (smokeFreeDays >= 7) score += 50; // 50 điểm cho 7 ngày
            if (smokeFreeDays >= 30) score += 200; // 200 điểm cho 30 ngày
            if (smokeFreeDays >= 90) score += 500; //500 điểm cho 90 ngày
            return score;
        }
        public async Task CheckAndAwardBadges(int userId, int score)
        {
            var userExistingBadgeIds = await _context.UserBadges
                                             .Where(ub => ub.UserId == userId)
                                             .Select(ub => ub.BadgeId)
                                             .ToListAsync();

            var allBadges = await _context.Badges
                                 .OrderBy(b => b.RequiredScore)
                                 .ToListAsync();

            foreach (var badge in allBadges)
            {
                if (score >= badge.RequiredScore)
                {
                    if (!userExistingBadgeIds.Contains(badge.BadgeId))
                    {
                        var userBadge = new UserBadge
                        {
                            UserId = userId,
                            BadgeId = badge.BadgeId,                          
                            EarnedAt = DateTime.UtcNow
                        };
                        await _userBadgeRepository.CreateAsync(userBadge);
                        Console.WriteLine($"Người dùng {userId} đã nhận được huy hiệu '{badge.Name}'.");
                    }
                }
            }
            await _context.SaveChangesAsync();
        }
    }
}
