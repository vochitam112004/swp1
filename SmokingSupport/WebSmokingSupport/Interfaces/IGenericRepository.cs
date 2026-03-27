using WebSmokingSupport.Entity;

namespace WebSmokingSupport.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<List<T>> GetAllAsync();
        Task<int> CreateAsync(T entity);
        Task<int> UpdateAsync(T entity);
        Task<T?> GetByIdAsync(int id);
        Task<bool> RemoveAsync(T entity);
    }
}
