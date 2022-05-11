using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.KeHoachTDG
{
    public class KeHoachTDGController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/KeHoachTDG/GetAll")]
        public IHttpActionResult GetAll(int IdDonVi)
        {
            var data = db.tblKeHoachTDGs.Where(t => t.IdDonVi == IdDonVi)
                .OrderByDescending(t => t.NamHocKT);
            return Ok(data);
        }

        [HttpPost]
        [Route("api/KeHoachTDG/Save")]
        public IHttpActionResult Save([FromBody] tblKeHoachTDG data)
        {

            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Id == null || data.Id == 0)
            {
                db.tblKeHoachTDGs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);

        }
        private void Validate(tblKeHoachTDG item)
        {
            if (string.IsNullOrEmpty(item.NoiDung))
            {
                ModelState.AddModelError("NoiDung", "Nội dung bắt buộc nhập");
                ModelState.AddModelError("NoiDung", "has-error");
            }
            if (item.NgayBD == null)
            {
                ModelState.AddModelError("NgayBD", "Ngày bắt đầu bắt buộc nhập");
                ModelState.AddModelError("NgayBD", "has-error");
            }
            if (item.NgayKT == null)
            {
                ModelState.AddModelError("NgayKT", "Ngày kết thúc bắt buộc nhập");
                ModelState.AddModelError("NgayKT", "has-error");
            }
            if(item.NamHocBD == 0 || item.NamHocKT == 0)
            {
                ModelState.AddModelError("NamHoc", "Năm học bắt buộc nhập");
                ModelState.AddModelError("NamHoc", "has-error");
            }
        }

        [HttpGet]
        [Route("api/KeHoachTDG/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblKeHoachTDGs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblKeHoachTDGs.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }
    }
}
