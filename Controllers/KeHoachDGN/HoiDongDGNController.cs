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
    [Authorize]
    public class HoiDongDGNController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [AllowAnonymous]
        [HttpGet]
        [Route("api/HoiDongDGN/GetAll")]
        public IHttpActionResult GetAll(int IdDonVi, int IdKeHoachDGN)
        {
            var data = (from hd in db.tblHoiDongDGNs
                        join cv in db.tblDanhmucs.Where(t => t.Maloai == "CHUCVU")
                        on hd.IdChucVu equals cv.Id
                        join nv in db.tblDanhmucs.Where(t => t.Maloai == "NHIEMVU")
                        on hd.IdNhiemVuDGN equals nv.Id
                        join us in db.UserProfiles
                        on hd.Username equals us.UserName
                        where hd.IdDonVi == IdDonVi && hd.IdKeHoachDGN == IdKeHoachDGN
                        select new { hd, cv, nv, us }).OrderBy(x => x.hd.STT);
            return Ok(data);
        }

        [HttpPost]
        [Route("api/HoiDongDGN/Save")]
        public IHttpActionResult Save([FromBody] tblHoiDongDGN data)
        {

            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.STT == 0)
            {
                var dt = db.tblHoiDongDGNs.Where(t => t.FInUse == true && t.IdDonVi == data.IdDonVi
                && t.IdKeHoachDGN == data.IdKeHoachDGN);
                if (dt != null && dt.Count() > 0)
                    data.STT = dt.Max(t => t.STT) + 1;
                else data.STT = 1;

            }

            if (data.Id == 0)
            {
                db.tblHoiDongDGNs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);

        }
        private void Validate(tblHoiDongDGN item)
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
            if (item.IdNhiemVuDGN == null | item.IdNhiemVuDGN == 0)
            {
                ModelState.AddModelError("IdNhiemVuDGN", "Nhiệm vụ bắt buộc nhập");
                ModelState.AddModelError("IdNhiemVuDGN", "has-error");
            }
            
        }

        [HttpGet]
        [Route("api/HoiDongDGN/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblHoiDongDGNs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblHoiDongDGNs.Remove(dt);
            //if (dt != null)
            //{
            //    var dataTC = db.tblPhanCongTCs.Where(
            //    t => t.IdDonVi == dt.IdDonVi
            //    && t.IdKeHoachTDG == dt.IdKeHoachTDG
            //    && t.Username == dt.Username
            //    );
            //    if (dataTC.Any())
            //        db.tblPhanCongTCs.RemoveRange(dataTC);
            //}

            db.SaveChanges();
            return Ok(dt);

        }
    }
}
