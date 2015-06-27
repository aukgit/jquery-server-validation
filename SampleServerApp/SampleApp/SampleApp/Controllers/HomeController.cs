using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace SampleApp.Controllers {
    public class HomeController : Controller {
        public ActionResult Index() {
            return View();
        }

        public ActionResult About() {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact() {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public JsonResult Request() {
            Thread.Sleep(2000);
            
            var x = new {
                message = "Field is valid.",
                isValid = true,
                isError = false,
                errorCode = "",
                errorMessage = ""
            };
            return Json(x, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public JsonResult Request(int id) {
            Thread.Sleep(id);
            var x = new {
                message= "Field is valid.",
                isValid= true,
                isError= false,
                errorCode= "",
                errorMessage= ""
            };
            return Json(x, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public JsonResult RequestInvalid(int id) {
            Thread.Sleep(id);
            var x = new {
                message = "Field is invalid.",
                isValid = false,
                isError = true,
                errorCode = "500",
                errorMessage = "Field is invalid"
            };
            return Json(x, JsonRequestBehavior.AllowGet);
        }
    }
}