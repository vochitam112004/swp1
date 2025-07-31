using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebSmokingSupport.Data;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;

namespace WebSmokingSupport.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(QuitSmokingSupportContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
        public async Task CreateAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }
        public async Task<UserBadge?> GetByIdsAsync(int userId, int badgeId)
        {
            return await _context.UserBadges.FindAsync(userId, badgeId);
        }

        public async Task<bool> DeleteAsync(int userId, int badgeId)
        {
            var userBadge = await _context.UserBadges.FindAsync(userId, badgeId);
            if (userBadge == null) return false;

            _context.UserBadges.Remove(userBadge);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
