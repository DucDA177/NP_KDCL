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
        public IHttpActionResult LayDuLieuBang(string noiDung)
        {
            var IdDonvi = Commons.Common.GetCurrentDonVi(db);
            return Ok(db.DMTieuChis.Where(x => x.IdDonVi == IdDonvi
            && (x.NoiDung.Contains(noiDung) || string.IsNullOrEmpty(noiDung))).OrderBy(t => t.STT).ToList());
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
            int curDonvi = Convert.ToInt32(Commons.Common.GetCurrentDonVi(db));
            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.STT == 0 || string.IsNullOrEmpty(data.STT.ToString().Trim()))
            {
                var dt = db.DMTieuChis.Where(t => t.IdDonVi == curDonvi);
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
        public IHttpActionResult LaySTT(int tieuChiID)
        {
            int curDonvi = Convert.ToInt32(Commons.Common.GetCurrentDonVi(db));
            var data = db.DMTieuChis.Where(x => x.Id == tieuChiID).FirstOrDefault();
            int maxSTT = 0;

            var dsTieuChi = db.DMTieuChis.Where(x => x.IdDonVi == curDonvi).ToList();

            if (dsTieuChi.Count > 0)
            {
                maxSTT = dsTieuChi.Max(t => t.STT);
            }

            return Ok(data != null ? data.STT : (maxSTT + 1));
        }

        /// <summary>
        /// Validate dữ liệu trước khi lưu
        /// </summary>
        /// <param name="data"></param>
        private void Validate(DMTieuChi data)
        {
            if (string.IsNullOrEmpty(data.NoiDung))
            {
                ModelState.AddModelError("NoiDung", "Nội dung tiêu chí bắt buộc nhập");
            }
        }
    }
}
