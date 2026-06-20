using Project1.Models;

namespace Project1.Interfaces
{
    public interface IMessageRepository
    {
        ICollection<Message> getMessages();
        Message GetMessage(int id);
        bool removeMessage(Message message);
        bool addMessage(Message message);
    }
}
