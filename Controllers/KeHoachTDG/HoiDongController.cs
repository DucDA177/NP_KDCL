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
    [Authorize]
    public class HoiDongController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [AllowAnonymous]
        [HttpGet]
        [Route("api/HoiDong/GetAll")]
        public IHttpActionResult GetAll(int IdDonVi, int IdKeHoachTDG)
        {
            var data = from hd in db.tblHoiDongs
                       join cv in db.tblDanhmucs.Where(t => t.Maloai == "CHUCVU") 
                       on hd.IdChucVu equals cv.Id
                       join nv in db.tblDanhmucs.Where(t => t.Maloai == "NHIEMVU")
                       on hd.IdNhiemVu equals nv.Id
                       join us in db.UserProfiles 
                       on hd.Username equals us.UserName
                       where hd.IdDonVi == IdDonVi && hd.IdKeHoachTDG == IdKeHoachTDG
                       select new {hd, cv, nv, us};
            return Ok(data);
        }

        [HttpPost]
        [Route("api/HoiDong/Save")]
        public IHttpActionResult Save([FromBody] tblHoiDong data)
        {

            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if ( data.Id == 0)
            {
                db.tblHoiDongs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);

        }
        private void Validate(tblHoiDong item)
        {
            if (string.IsNullOrEmpty(item.Username))
            {
                ModelState.AddModelError("Username", "Họ và tên bắt buộc chọn");
                ModelState.AddModelError("Username", "has-error");
            }
            if (item.IdChucVu == null | item.IdChucVu == 0)
            {
                ModelState.AddModelError("IdChucVu", "Chức vụ bắt buộc nhập");
                ModelState.AddModelError("IdChucVu", "has-error");
            }
            if (item.IdNhiemVu == null | item.IdNhiemVu == 0)
            {
                ModelState.AddModelError("IdNhiemVu", "Nhiệm vụ bắt buộc nhập");
                ModelState.AddModelError("IdNhiemVu", "has-error");
            }
        }

        [HttpGet]
        [Route("api/HoiDong/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblHoiDongs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblHoiDongs.Remove(dt);
            if(dt != null)
            {
                var dataTC = db.tblPhanCongTCs.Where(
                t => t.IdDonVi == dt.IdDonVi
                && t.IdKeHoachTDG == dt.IdKeHoachTDG
                && t.Username == dt.Username
                );
                if (dataTC.Any())
                    db.tblPhanCongTCs.RemoveRange(dataTC);
            }
            
            db.SaveChanges();
            return Ok(dt);

        }
    }
}
