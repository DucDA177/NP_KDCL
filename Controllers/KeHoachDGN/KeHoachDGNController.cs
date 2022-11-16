using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.KeHoachDGN
{
    public class KeHoachDGNController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/KeHoachDGN/GetAll")]
        public IHttpActionResult GetAll(int IdDonVi)
        {
            var data = db.tblKeHoachDGNs.Where(t => t.IdDonVi == IdDonVi);
            return Ok(data);
        }

        [HttpPost]
        [Route("api/KeHoachDGN/Save")]
        public IHttpActionResult Save([FromBody] tblKeHoachDGN data)
        {

            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Id == null || data.Id == 0)
            {
                db.tblKeHoachDGNs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);

        }

        private void Validate(tblKeHoachDGN item)
        {
            if (string.IsNullOrEmpty(item.NoiDung))
            {
                ModelState.AddModelError("NoiDung", "Nội dung bắt buộc nhập");
                ModelState.AddModelError("NoiDung", "has-error");
            }
            if (string.IsNullOrEmpty(item.MucDich))
            {
                ModelState.AddModelError("MucDich", "Mục đích bắt buộc nhập");
                ModelState.AddModelError("MucDich", "has-error");
            }
        }
    }
}
