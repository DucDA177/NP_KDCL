using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.ThongTinTDG
{
    [Authorize]
    public class MinhChungController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

    }
}
