using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Models;

namespace TodoApp.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options ): base(options)
        {
            
        }

        public DbSet<Todo> Todos { get; set; }
    }
}
