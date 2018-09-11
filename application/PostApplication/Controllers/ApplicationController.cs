using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using log4net;
using Microsoft.AspNetCore.Mvc;
using PostApplication.Models;
using PostApplication.Utils;

namespace PostApplication.Controllers
{
    [Route("postapplication/[controller]")]
    public class ApplicationController : Controller
    {
        private ILog log = LogManager.GetLogger(Startup.LogRepository.Name, typeof(ApplicationController));
        private readonly PostgresContext _context;

        public ApplicationController(PostgresContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 申请职位
        /// </summary>
        /// <returns></returns>
        [HttpGet("{demandNO}/{resourceNO}")]
        public IActionResult CreateApplication(string demandNO, string resourceNO)
        {
            log.Debug("CreateApplication");
            var cnt = _context.TPostApplication.Count<TPostApplication>(opt => opt.DemandNo == demandNO && opt.ResourceNo == resourceNO);
            if (cnt == 0)
            {
                var application = new TPostApplication()
                {
                    ApplyDate = DateTime.Now,
                    DemandNo = demandNO,
                    ResourceNo = resourceNO,
                    Status = ((int)ApplicationStatus.Apply).ToString(),
                    RegisterDate = DateTime.Now,
                    UpdateDate = DateTime.Now
                };
                _context.Add<TPostApplication>(application);
                _context.SaveChanges();

                OkObjectResult ret = new OkObjectResult(application);
                Response.StatusCode = (int)HttpStatusCode.Created;
                return ret;
            }
            else
            {
                var result = new ContentResult();
                result.StatusCode = (int)HttpStatusCode.NotAcceptable;
                result.Content = "不可以重复申请。";
                return result;
            }
        }

        /// <summary>
        /// 获取最新的申请书
        /// </summary>
        /// <returns></returns>
        [HttpGet()]
        public IActionResult Get()
        {
            var applications = from app in _context.TPostApplication
                           orderby app.UpdateDate descending
                           select app;

            OkObjectResult ret = new OkObjectResult(applications.Take<TPostApplication>(30));

            return ret;
        }

        /// <summary>
        /// 获取指定编号的申请书
        /// </summary>
        /// <param name="applicationNO"></param>
        /// <returns></returns>
        [HttpGet("{applicationNO}")]
        public IActionResult Get(string applicationNO)
        {
            var application = _context.TPostApplication.Find(applicationNO);
            OkObjectResult ret = new OkObjectResult(application);
            return ret;
        }

        /// <summary>
        /// 删除指定编号的申请书
        /// </summary>
        /// <param name="applicationNO"></param>
        /// <returns></returns>
        [HttpDelete("Cancel/{applicationNO}")]
        public IActionResult Cancel(string applicationNO)
        {
            var updRet = UpdateStatus(applicationNO, ApplicationStatus.Cancel);
            if (updRet)
            {
                return Ok();
            }
            else
            {
                ReturnResult result = new ReturnResult();
                result.Code = 400;
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return new JsonResult(result);
            }

        }

        /// <summary>
        /// 接受申请
        /// </summary>
        /// <param name="applicationNO"></param>
        /// <returns></returns>
        [HttpGet("Accept/{applicationNO}")]
        public IActionResult Accept(string applicationNO)
        {
            var updRet = UpdateStatus(applicationNO, ApplicationStatus.Accept);
            if (updRet)
            {
                return Ok();
            }
            else
            {
                ReturnResult result = new ReturnResult();
                result.Code = 400;
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return new JsonResult(result);
            }
        }

        /// <summary>
        /// 拒绝申请
        /// </summary>
        /// <param name="applicationNO"></param>
        /// <returns></returns>
        [HttpGet("Reject/{applicationNO}")]
        public IActionResult Reject(string applicationNO)
        {
            var updRet = UpdateStatus(applicationNO, ApplicationStatus.Reject);
            if (updRet)
            {
                return Ok();
            }
            else
            {
                ReturnResult result = new ReturnResult();
                result.Code = 400;
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return new JsonResult(result);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationNO"></param>
        /// <param name="status"></param>
        private bool UpdateStatus(string applicationNO, ApplicationStatus status)
        {
            var applications = _context.TPostApplication.Where<TPostApplication>(opt => opt.ApplicationNo == applicationNO);
            if(applications.Count<TPostApplication>() == 0)
            {
                return false;
            }

            foreach (var app in applications)
            {
                app.Status = ((int)status).ToString();
                app.UpdateDate = DateTime.Now;
                _context.TPostApplication.UpdateRange(app);
            }
            _context.SaveChanges();
            return true;
        }
    }
}
