using WebSmokingSupport.Entity;

namespace WebSmokingSupport.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);

    }
}
