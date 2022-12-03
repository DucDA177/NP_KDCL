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
    public class DoanDGNController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/DoanDGN/GetAll")]
        public IHttpActionResult GetAll(int IdDonVi)
        {
            var data = db.tblDoanDGNs.Where(x => x.IdDonVi == IdDonVi)
                .OrderBy(x => x.STT);

            return Ok(data);
        }

        [HttpPost]
        [Route("api/DoanDGN/Save")]
        public IHttpActionResult Save([FromBody] DoanDGNRequest data)
        {
            var isAdding = false;

            Validate(data.DoanDGN);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.DoanDGN.STT == 0)
            {
                var dt = db.tblDoanDGNs.Where(t => t.FInUse == true && t.IdDonVi == data.DoanDGN.IdDonVi);
                if (dt != null && dt.Count() > 0)
                    data.DoanDGN.STT = dt.Max(t => t.STT) + 1;
                else data.DoanDGN.STT = 1;

            }

            if (data.DoanDGN.Id == 0)
            {
                isAdding = true;
                db.tblDoanDGNs.Add(data.DoanDGN);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data.DoanDGN).State = EntityState.Modified;
                db.SaveChanges();

            }

            string checkTruongDGN = SaveTruongDGN(data);

            if (!string.IsNullOrEmpty(checkTruongDGN))
            {
                if (isAdding)
                {
                    db.tblDoanDGNs.Remove(data.DoanDGN);
                    db.SaveChanges();
                }
                return BadRequest(checkTruongDGN);
            }

            return Ok(data);

        }
        private void Validate(tblDoanDGN item)
        {
            if (string.IsNullOrEmpty(item.Ten))
            {
                ModelState.AddModelError("Ten", "Tên đoàn đánh giá ngoài bắt buộc chọn");
                ModelState.AddModelError("Ten", "has-error");
            }


        }

        private string SaveTruongDGN(DoanDGNRequest data)
        {
            var listIdTruong = data.TruongDGN.Select(x => x.Id);
            var checkToDelete = db.tblTruongDGNs
                .Where(x => x.IdDoanDGN == data.DoanDGN.Id && !listIdTruong.Contains(x.IdTruong));
            if(checkToDelete.Any())
            {
                db.tblTruongDGNs.RemoveRange(checkToDelete);
                db.SaveChanges();
            }    

            foreach (var item in data.TruongDGN)
            {
                tblTruongDGN tblTruongDGN = new tblTruongDGN();

                tblTruongDGN = db.tblTruongDGNs.Where(x => x.IdDoanDGN == data.DoanDGN.Id
                && x.IdTruong == item.Id && x.IdKeHoachTDG == item.IdKeHoachTDG).FirstOrDefault();

                if (tblTruongDGN == null)
                {
                    
                    var KHTDGHienTai = db.tblKeHoachTDGs
                        .Where(x => x.IdDonVi == item.Id && x.TrangThai == "DTH")
                        .FirstOrDefault();
                    if (KHTDGHienTai == null)
                        KHTDGHienTai = db.tblKeHoachTDGs
                            .Where(x => x.IdDonVi == item.Id && x.TrangThai == "CTH")
                            .OrderByDescending(x => x.NamHocKT)
                            .FirstOrDefault();
                    if (KHTDGHienTai == null)
                        return "Đơn vị " + item.TenDonVi
                            + " chưa có kế hoạch tự đánh giá nào. Vui lòng chọn lại sau khi đơn vị này có kế hoạch tự đánh giá";
                    var checkExist = db.tblTruongDGNs.Where(x => x.IdKeHoachTDG == KHTDGHienTai.Id).Any();
                    if (checkExist)
                        return "Kế hoạch tự đánh giá của đơn vị " + item.TenDonVi
                            + " đã được đánh giá bởi đoàn đánh giá ngoài khác. Vui lòng chọn lại";

                    tblTruongDGN = new tblTruongDGN();
                    tblTruongDGN.IdDoanDGN = data.DoanDGN.Id;
                    tblTruongDGN.IdTruong = item.Id;
                    tblTruongDGN.IdKeHoachTDG = KHTDGHienTai.Id;
                    tblTruongDGN.LamViecTu = item.LamViecTu;
                    tblTruongDGN.LamViecDen = item.LamViecDen;

                    db.tblTruongDGNs.Add(tblTruongDGN);
                }
                else
                {
                    tblTruongDGN.LamViecTu = item.LamViecTu;
                    tblTruongDGN.LamViecDen = item.LamViecDen;
                }

                db.SaveChanges();

                var currentTruongDoan = db.tblThanhVienDGNs
                    .Where(x => x.IdTruongDGN == tblTruongDGN.Id && x.TruongDoan == true)
                    .FirstOrDefault();
                if (currentTruongDoan != null)
                {
                    if (currentTruongDoan.Username == item.TruongDoan)
                        continue;

                    currentTruongDoan.TruongDoan = false;
                    currentTruongDoan.ThuKy = false;
                    currentTruongDoan.UyVien = true;
                }
                var existTruongDoan = db.tblThanhVienDGNs
                    .Where(x => x.IdTruongDGN == tblTruongDGN.Id && x.Username == item.TruongDoan)
                    .FirstOrDefault();
                if (existTruongDoan != null)
                {
                    existTruongDoan.TruongDoan = true;
                    currentTruongDoan.ThuKy = false;
                    currentTruongDoan.UyVien = false;
                }
                else
                {
                    tblThanhVienDGN tblThanhVienDGN = new tblThanhVienDGN();

                    tblThanhVienDGN.IdTruongDGN = tblTruongDGN.Id;
                    tblThanhVienDGN.Username = item.TruongDoan;
                    tblThanhVienDGN.TruongDoan = true;

                    db.tblThanhVienDGNs.Add(tblThanhVienDGN);
                    db.SaveChanges();
                }
            }

            return null;
        }


        [HttpGet]
        [Route("api/DoanDGN/LoadTruongDGN")]
        public IHttpActionResult LoadTruongDGN(int IdDoanDGN)
        {
            var dt = from truong in db.tblTruongDGNs
                     join tv in db.tblThanhVienDGNs
                     on truong.Id equals tv.IdTruongDGN
                     join dv in db.DMDonVis
                     on truong.IdTruong equals dv.Id
                     where truong.IdDoanDGN == IdDoanDGN
                     && tv.TruongDoan == true
                     select new TruongDGNViewModel
                     {
                         Id = truong.IdTruong,
                         IdDoanDGN = IdDoanDGN,
                         IdKeHoachTDG = truong.IdKeHoachTDG,
                         TenDonVi = dv.TenDonVi,
                         LamViecTu = truong.LamViecTu,
                         LamViecDen = truong.LamViecDen,
                         TruongDoan = tv.Username
                     };

            return Ok(dt);
        }


        [HttpGet]
        [Route("api/DoanDGN/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblDoanDGNs.Find(Id);
            db.tblDoanDGNs.Remove(dt);

            var truong = db.tblTruongDGNs.Where(x => x.IdDoanDGN == Id);
            if (truong.Any())
                db.tblTruongDGNs.RemoveRange(truong);

            db.SaveChanges();

            return Ok(dt);
        }

        [HttpGet]
        [Route("api/DoanDGN/GetUsersExceptDV")]
        public IHttpActionResult GetUsersExceptDV(int IdDonVi, string MaDVExcept)
        {
            var check = db.DMDonVis.Find(IdDonVi).LoaiDonVi != MaDVExcept;
            if (check)
            {
                var users = from us in db.UserProfiles
                            join dv in db.DMDonVis
                            on us.IDDonVi equals dv.Id
                            where us.IDDonVi == IdDonVi && us.FInUse == true
                            select new
                            {
                                Username = us.UserName,
                                IdDonVi = us.IDDonVi,
                                HoTen = us.HoTen,
                                ChucVu = us.ChucVu,
                                NoiCongTac = dv.TenDonVi
                            };
                return Ok(users);
            }

            return Ok();
        }
    }
}
