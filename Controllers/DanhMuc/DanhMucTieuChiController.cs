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
        public IHttpActionResult LayDuLieuBang(int IdDonVi, int IdTieuChuan)
        {
            return Ok(db.DMTieuChis.Where(x => x.IdDonVi == IdDonVi
            && x.IdTieuChuan == IdTieuChuan).OrderBy(t => t.STT).ToList());
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

            if (data.STT == 0 || string.IsNullOrEmpty(data.STT.ToString().Trim()))
            {
                var dt = db.DMTieuChis.Where(t => t.IdDonVi == data.IdDonVi);
                if (dt != null && dt.Count() > 0)
                    data.STT = dt.Max(t => t.STT) + 1;
                else data.STT = 1;

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
        public IHttpActionResult LaySTT(int IdDonVi, int IdTieuChuan)
        {
            var dsTieuChi = db.DMTieuChis.Where(x => x.IdDonVi == IdDonVi && x.IdTieuChuan == IdTieuChuan).ToList();

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
            if (string.IsNullOrEmpty(data.NoiDungA))
            {
                ModelState.AddModelError("NoiDungA", "Nội dung chỉ số A bắt buộc nhập");
                ModelState.AddModelError("NoiDungA", "has-error");
            }
            if (string.IsNullOrEmpty(data.NoiDungB))
            {
                ModelState.AddModelError("NoiDungB", "Nội dung chỉ số B bắt buộc nhập");
                ModelState.AddModelError("NoiDungB", "has-error");
            }
            if (string.IsNullOrEmpty(data.NoiDungC))
            {
                ModelState.AddModelError("NoiDungC", "Nội dung chỉ số C bắt buộc nhập");
                ModelState.AddModelError("NoiDungC", "has-error");
            }

            if (string.IsNullOrEmpty(data.YeuCauA))
            {
                ModelState.AddModelError("YeuCauA", "Yêu cầu chỉ số A bắt buộc nhập");
                ModelState.AddModelError("YeuCauA", "has-error");
            }
            if (string.IsNullOrEmpty(data.YeuCauB))
            {
                ModelState.AddModelError("YeuCauB", "Yêu cầu chỉ số B bắt buộc nhập");
                ModelState.AddModelError("YeuCauB", "has-error");
            }
            if (string.IsNullOrEmpty(data.YeuCauC))
            {
                ModelState.AddModelError("YeuCauC", "Yêu cầu chỉ số C bắt buộc nhập");
                ModelState.AddModelError("YeuCauC", "has-error");
            }

            if (string.IsNullOrEmpty(data.GoiYA))
            {
                ModelState.AddModelError("GoiYA", "Gợi ý chỉ số A bắt buộc nhập");
                ModelState.AddModelError("GoiYA", "has-error");
            }
            if (string.IsNullOrEmpty(data.GoiYB))
            {
                ModelState.AddModelError("GoiYB", "Gợi ý chỉ số B bắt buộc nhập");
                ModelState.AddModelError("GoiYB", "has-error");
            }
            if (string.IsNullOrEmpty(data.GoiYC))
            {
                ModelState.AddModelError("GoiYC", "Gợi ý chỉ số C bắt buộc nhập");
                ModelState.AddModelError("GoiYC", "has-error");
            }
        }
    }
}
