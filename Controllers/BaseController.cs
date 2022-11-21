using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    public class BaseController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        [HttpGet]
        [Route("api/Base/GetDMDonVi")]
        public IHttpActionResult GetDMDonVi(string PhanLoai,string SearchKey)
        {
            var rs = (from dv in db.DMDonVis where dv.FInUse == true select dv);
            if (!string.IsNullOrWhiteSpace(PhanLoai))
            {
                rs = rs.Where(dv => dv.LoaiDonVi==PhanLoai);
            }
            if (!string.IsNullOrWhiteSpace(SearchKey))
            {
                rs = rs.Where(dv => dv.TenDonVi.Contains(SearchKey));
            }
            return Ok(rs);
        }
    }
}
