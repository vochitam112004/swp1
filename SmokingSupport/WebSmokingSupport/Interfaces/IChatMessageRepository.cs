using WebSmokingSupport.Entity;
namespace WebSmokingSupport.Interfaces
{
    public interface IChatMessageRepository : IGenericRepository<ChatMessage>
    {
        Task<List<ChatMessage>> GetChatMessageHistory(int user1Id, int user2Id);
        Task CreateMessageAsync(ChatMessage message);
    }
}
