using Microsoft.AspNetCore.Mvc;
using PostApplication.Models;
using PostApplication.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PostApplication.Controllers
{
    [Route("postapplication/[controller]")]
    public class ResourceController : Controller
    {
        private readonly PostgresContext _context;

        public ResourceController(PostgresContext context)
        {
            _context = context;
        }

        [HttpGet("{resourceNO}")]
        public IActionResult Get(string resourceNO)
        {
            var applications = _context.TPostApplication.Where<TPostApplication>(opt => opt.ResourceNo == resourceNO);
            OkObjectResult ret = new OkObjectResult(applications);
            return ret;
        }

        [HttpDelete("{resourceNO}")]
        public IActionResult Delete(string resourceNO)
        {
            var applications = _context.TPostApplication.Where<TPostApplication>(opt => opt.ResourceNo == resourceNO);

            foreach (var app in applications)
            {
                app.Status = ((int)ApplicationStatus.ResourceDelete).ToString();
                app.UpdateDate = DateTime.Now;
                _context.TPostApplication.UpdateRange(app);
            }
            _context.SaveChanges();

            return Ok();
        }
    }
}
