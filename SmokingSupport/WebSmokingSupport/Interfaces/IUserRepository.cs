using WebSmokingSupport.Entity;
namespace WebSmokingSupport.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByEmailAsync(string email);
        Task CreateAsync(User user);
        Task<User> GetByUsernameAsync(string username);
        Task<UserBadge?> GetByIdsAsync(int userId, int badgeId);
        Task<bool> DeleteAsync(int userId, int badgeId);

    }
}
