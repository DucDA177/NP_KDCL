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

        [HttpGet]
        [Route("api/KeHoachTDG/LoadListNamHoc")]
        public IHttpActionResult LoadListNamHoc()
        {
            var data = db.tblKeHoachTDGs.GroupBy(t => new { t.NamHocBD, t.NamHocKT })
                .Select(t => t.FirstOrDefault())
                .OrderByDescending(t => t.NamHocKT)
                .Select(t => t.NamHocBD + "-" + t.NamHocKT);

            return Ok(data);
        }

        [HttpGet]
        [Route("api/KeHoachTDG/LoadKeHoachTDGHienTai")]
        public IHttpActionResult LoadKeHoachTDGHienTai(string NamHoc, int IdDonVi)
        {
            if (string.IsNullOrEmpty(NamHoc))
                return Ok();

            var NamHocBD = Convert.ToInt32(NamHoc.Split('-').First());
            var NamHocKT = Convert.ToInt32(NamHoc.Split('-').Last());

            var data = db.tblKeHoachTDGs.Where(t => t.IdDonVi == IdDonVi
            && t.NamHocBD <= NamHocBD && t.NamHocKT >= NamHocKT)
                .OrderByDescending(t => t.NamHocKT)
                .FirstOrDefault();

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
                var checkKHTDG = db.tblKeHoachTDGs.Where(t => t.IdDonVi == data.IdDonVi && t.NamHocBD <= data.NamHocBD && t.NamHocKT >= data.NamHocKT).Any();
                if (checkKHTDG)
                    return BadRequest("Giai đoạn " + data.NamHocBD + " - " + data.NamHocKT + " đã tồn tại kế hoạch tự đánh giá");

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
            if (item.NamHocBD == 0 || item.NamHocKT == 0)
            {
                ModelState.AddModelError("NamHoc", "Năm học bắt buộc nhập");
                ModelState.AddModelError("NamHoc", "has-error");
            }
            if (item.IdQuyDinhTC == null || item.IdQuyDinhTC == 0)
            {
                ModelState.AddModelError("IdQuyDinhTC", "Quy định tiêu chuẩn bắt buộc nhập");
                ModelState.AddModelError("IdQuyDinhTC", "has-error");
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
