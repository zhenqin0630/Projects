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
    public class DemandController : Controller
    {
        private readonly PostgresContext _context;

        public DemandController(PostgresContext context)
        {
            _context = context;
        }

        [HttpGet("{demandNO}")]
        public IActionResult Get(string demandNO)
        {
            var applications = _context.TPostApplication.Where<TPostApplication>(opt => opt.DemandNo == demandNO);
            OkObjectResult ret = new OkObjectResult(applications);
            return ret;
        }

        [HttpDelete("{demandNO}")]
        public IActionResult Delete(string demandNO)
        {
            var applications = _context.TPostApplication.Where<TPostApplication>(opt => opt.DemandNo == demandNO);

            foreach (var app in applications)
            {
                app.Status = ((int)ApplicationStatus.DemandDelete).ToString();
                app.UpdateDate = DateTime.Now;
                _context.TPostApplication.UpdateRange(app);
            }
            _context.SaveChanges();
            return Ok();
        }

    }
}
