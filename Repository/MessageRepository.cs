using Project1.Data;
using Project1.Interfaces;
using Project1.Models;

namespace Project1.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext _context;
        public MessageRepository(AppDbContext context) 
        {
            _context = context;
        }

        public bool addMessage(Message message)
        {
            _context.Add(message);
            return Save();
        }

        public Message GetMessage(int id)
        {
            return _context.Messages.Where(c => c.Id == id).FirstOrDefault();
        }

        public ICollection<Message> getMessages()
        {
            return _context.Messages.ToArray();
        }

        public bool removeMessage(Message message)
        {
            _context.Messages.Remove(message);
            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }
    }
}
