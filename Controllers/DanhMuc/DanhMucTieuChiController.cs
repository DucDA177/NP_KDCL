using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.DanhMuc
{
    [Authorize]
    public class DanhMucTieuChiController : ApiController
    {
        // GET: api/DanhMucTieuChi
        private WebApiDataEntities db = new WebApiDataEntities();
        public IHttpActionResult Get()
        {
            return Ok(db.DMTieuChis.Where(t => t.FInUse == true).OrderBy(t => t.STT).ToList());
        }

        /// <summary>
        /// Api lấy dữ liệu danh mục tiêu chí
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/DanhMucTieuChi/LayDuLieuBang")]
        public IHttpActionResult LayDuLieuBang(int IdTieuChuan)
        {
            return Ok(db.DMTieuChis.Where(x => x.IdTieuChuan == IdTieuChuan).OrderBy(t => t.ThuTu).ToList());
        }

        /// <summary>
        /// API lưu danh mục tiêu chí
        /// </summary>
        /// <param name="ndkt"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/DanhMucTieuChi/LuuDanhMucTieuChi")]
        public IHttpActionResult Save([FromBody] DMTieuChi data)
        {
            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.ThuTu == 0 || string.IsNullOrEmpty(data.ThuTu.ToString().Trim()))
            {
                var dt = db.DMTieuChis.Where(t => t.IdTieuChuan == data.IdTieuChuan);
                if (dt != null && dt.Count() > 0)
                    data.ThuTu = dt.Max(t => t.ThuTu) + 1;
                else data.ThuTu = 1;
                data.STT = data.ThuTu;
            }
            if (data.Id == null || data.Id == 0)
            {
                db.DMTieuChis.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);

        }

        /// <summary>
        /// API xóa danh mục tiêu chí
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/DanhMucTieuChi/XoaDanhMucTieuChi")]
        public IHttpActionResult Delete(int Id)
        {
            var dt = db.DMTieuChis.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            //dt.FInUse = false;
            db.DMTieuChis.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }

        /// <summary>
        /// API load STT danh mục tiêu chí
        /// </summary>
        /// <param name="TieuChuanID">ID danh mục tiêu chí</param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/DanhMucTieuChi/LaySTT")]
        public IHttpActionResult LaySTT(int IdTieuChuan)
        {
            var dsTieuChi = db.DMTieuChis.Where(x => x.IdTieuChuan == IdTieuChuan).ToList();

            return Ok(dsTieuChi.Count + 1);
        }

        /// <summary>
        /// Validate dữ liệu trước khi lưu
        /// </summary>
        /// <param name="data"></param>
        private void Validate(DMTieuChi data)
        {
            if (data.IdTieuChuan == 0)
            {
                ModelState.AddModelError("TieuChuan", "Tiêu chuẩn bắt buộc chọn");
                ModelState.AddModelError("TieuChuan", "has-error");
            }

            if (string.IsNullOrEmpty(data.NoiDung))
            {
                ModelState.AddModelError("NoiDung", "Nội dung tiêu chí bắt buộc nhập");
                ModelState.AddModelError("NoiDung", "has-error");
            }

            if ( data.ThuTu == 0)
            {
                ModelState.AddModelError("ThuTu", "Thứ tự tiêu chí bắt buộc nhập");
                ModelState.AddModelError("ThuTu", "has-error");
            }
        }

        [HttpPost]
        [Route("api/DanhMucTieuChi/SavePhanCongTC")]
        public IHttpActionResult SavePhanCongTC(PhanCongTC PhanCongTC)
        {
            var check = db.tblPhanCongTCs
                .Where(x => x.Username == PhanCongTC.Username
                && x.IdDonVi == PhanCongTC.IdDonVi
                && x.IdKeHoachTDG == PhanCongTC.IdKeHoachTDG);
            if (check.Any())
            {
                db.tblPhanCongTCs.RemoveRange(check);
            }

            foreach(var item in PhanCongTC.ListIdTieuChi)
            {
                tblPhanCongTC pctc = new tblPhanCongTC();
                pctc.Username = PhanCongTC.Username;
                pctc.IdDonVi = PhanCongTC.IdDonVi;
                pctc.IdKeHoachTDG = PhanCongTC.IdKeHoachTDG;
                pctc.IdTieuChi = item;
                db.tblPhanCongTCs.Add(pctc);
            }

            db.SaveChanges();

            return Ok(PhanCongTC);
        }
        public class PhanCongTC
        {
            public int IdDonVi { get; set; }
            public int IdKeHoachTDG { get; set; }
            public List<int> ListIdTieuChi { get; set; }
            public string Username { get; set; }
        }
    }
}
