using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;
using TodoApp.Api.Models.DTO;

namespace TodoApp.Api.Controllers
{
    // https://localhost:xxxx/api/todos
    [Route("api/[controller]")]
    [ApiController]
    public class TodosController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TodosController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetTodos()
        {
            var todos = await _context.Todos.ToListAsync();
            return Ok(todos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTodoById(Guid id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            return Ok(todo);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTodoAsync([FromBody] TodoRequestDto todo)
        {

            if (todo == null || string.IsNullOrWhiteSpace(todo.Description))
            {
                return BadRequest("Todo description cannot be empty.");
            }

            // Map DTO to entity
            var todoEntity = new Todo
            {
                Description = todo.Description
            };


            todoEntity.Id = Guid.NewGuid();
            await _context.Todos.AddAsync(todoEntity);
            await _context.SaveChangesAsync();

            // Map entity back to DTO
            var todoResponseDto = new TodoDto
            {
                Id = todoEntity.Id,
                Description = todoEntity.Description
            };

            return CreatedAtAction(nameof(GetTodos), new { id = todoResponseDto.Id }, todoResponseDto);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateTodoAsync(Guid id, [FromBody] TodoRequestDto todo)
        {
            if (todo == null || string.IsNullOrWhiteSpace(todo.Description))
            {
                return BadRequest("Todo description cannot be empty.");
            }
            var existingTodo = await _context.Todos.FindAsync(id);
            if (existingTodo == null)
            {
                return NotFound();
            }
            existingTodo.Description = todo.Description;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
