using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.KeHoachDGN
{
    [Authorize]
    public class DoanDGNController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/DoanDGN/GetAll")]
        public IHttpActionResult GetAll(int IdDonVi)
        {
            var data = db.tblDoanDGNs.Where(x => x.IdDonVi == IdDonVi)
                .FirstOrDefault();

            return Ok(data);
        }
        [HttpGet]
        [Route("api/DoanDGN/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblDoanDGNs.Find(Id);
            db.tblDoanDGNs.Remove(dt);

            db.SaveChanges();

            return Ok(dt);
        }
    }
}
