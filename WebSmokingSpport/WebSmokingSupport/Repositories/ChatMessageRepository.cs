using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebSmokingSupport.Data;
using WebSmokingSupport.Entity;
using WebSmokingSupport.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace WebSmokingSupport.Repositories
{
    public class ChatMessageRepository : GenericRepository<ChatMessage>, IChatMessageRepository
    {

        public ChatMessageRepository(QuitSmokingSupportContext context) : base(context)
        {
        }
        public async Task<List<ChatMessage>> GetChatMessageHistory(int user1Id, int user2Id)
        {
            return await _context.ChatMessages
                .Where(m => (m.SenderId == user1Id && m.ReceiverId == user2Id)
                || (m.SenderId == user2Id && m.ReceiverId == user1Id))
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }
        public async Task CreateMessageAsync(ChatMessage message)
        {
            if (message == null) throw new ArgumentNullException(nameof(message));
            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();
        }
    }
}
