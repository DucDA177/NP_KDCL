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
    public class DanhMucTieuChuanController : ApiController
    {
        // GET: api/DanhMucTieuChuan
        private WebApiDataEntities db = new WebApiDataEntities();
        public IHttpActionResult Get()
        {
            return Ok(db.DMTieuChuans.Where(t => t.FInUse == true).OrderBy(t => t.STT).ToList());
        }

        /// <summary>
        /// Api lấy dữ liệu danh mục tiêu chuẩn
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/DanhMucTieuChuan/LoadTieuChuan")]
        public IHttpActionResult LoadTieuChuan(int IdDonVi)
        {
            return Ok(db.DMTieuChuans.Where(x => x.IdDonVi == IdDonVi).OrderBy(t => t.STT).ToList());
        }

        /// <summary>
        /// Api lấy dữ liệu danh mục tiêu chuẩn
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/DanhMucTieuChuan/LayDuLieuBang")]
        public IHttpActionResult LayDuLieuBang(int IdDonVi, int IdQuyDinh)
        {
            return Ok(db.DMTieuChuans.Where(x => x.IdDonVi == IdDonVi && x.IdQuyDinh == IdQuyDinh).OrderBy(t => t.STT).ToList());
        }

        /// <summary>
        /// API lưu danh mục tiêu chuẩn
        /// </summary>
        /// <param name="ndkt"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/DanhMucTieuChuan/LuuDanhMucTieuChuan")]
        public IHttpActionResult Save([FromBody] DMTieuChuan data)
        {
            int curDonvi = Convert.ToInt32(Commons.Common.GetCurrentDonVi(db));
            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.STT == 0 || string.IsNullOrEmpty(data.STT.ToString().Trim()))
            {
                var dt = db.DMTieuChuans.Where(t => t.IdDonVi == curDonvi);
                if (dt != null && dt.Count() > 0)
                    data.STT = dt.Max(t => t.STT) + 1;
                else data.STT = 1;

            }
            if (data.Id == null || data.Id == 0)
            {
                db.DMTieuChuans.Add(data);
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
        /// API xóa danh mục tiêu chuẩn
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/DanhMucTieuChuan/XoaDanhMucTieuChuan")]
        public IHttpActionResult Delete(int Id)
        {
            var dt = db.DMTieuChuans.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            //dt.FInUse = false;
            db.DMTieuChuans.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }

        /// <summary>
        /// API load STT danh mục tiêu chuẩn
        /// </summary>
        /// <param name="TieuChuanID">ID danh mục tiêu chuẩn</param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/DanhMucTieuChuan/LaySTT")]
        public IHttpActionResult LaySTT(int IdDonVi, int IdQuyDinh)
        {
            var dsTieuChuan = db.DMTieuChuans.Where(x => x.IdDonVi == IdDonVi && x.IdQuyDinh == IdQuyDinh).ToList();

            return Ok(dsTieuChuan.Count + 1);
        }

        /// <summary>
        /// Validate dữ liệu trước khi lưu
        /// </summary>
        /// <param name="data"></param>
        private void Validate(DMTieuChuan data)
        {
            if (data.IdQuyDinh == 0)
            {
                ModelState.AddModelError("QuyDinh", "Quy định tiêu chuẩn bắt buộc chọn");
                ModelState.AddModelError("QuyDinh", "has-error");
            }
            if (string.IsNullOrEmpty(data.NoiDung))
            {
                ModelState.AddModelError("NoiDung", "Nội dung tiêu chuẩn bắt buộc nhập");
                ModelState.AddModelError("NoiDung", "has-error");
            }
        }
    }
}
