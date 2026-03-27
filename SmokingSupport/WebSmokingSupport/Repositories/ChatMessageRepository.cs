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
        public async Task<List<ChatMessage>> GetChatMessageHistory(int userId1, int userId2)
        {
            return await _context.ChatMessages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => (m.SenderId == userId1 && m.ReceiverId == userId2)
                || (m.SenderId == userId2 && m.ReceiverId == userId1))
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
