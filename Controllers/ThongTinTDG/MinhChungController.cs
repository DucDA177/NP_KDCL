using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.ThongTinTDG
{
    [Authorize]
    public class MinhChungController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();


        
        [HttpGet]
        [Route("api/MinhChung/LoadDSMinhChung")]
        public IHttpActionResult LoadDSMinhChung(int IdDonVi, int idTieuChi, string heThongMa)
        {
            var result = db.tblMinhChungs.Where(x => x.IdDonVi == IdDonVi && x.HeThongMa == heThongMa && (x.IdTieuChi == idTieuChi || idTieuChi == 0)).ToList();

            return Ok(result);
        }

        /// <summary>
        /// Render danh sách hệ thống mã
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/MinhChung/LoadHeThongMa")]
        public IHttpActionResult LoadHeThongMa()
        {
            var result = new List<string>();
            for(int i = 1; i<100; i++)
            {
                result.Add(("H" + i));
            }
            return Ok(result);
        }

        /// <summary>
        /// Load số minh chứng
        /// </summary>
        /// <param name="heThongMa"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/MinhChung/LoadSoMinhChung")]
        public IHttpActionResult LoadSoMinhChung(string heThongMa)
        {
            var count = db.tblMinhChungs.Where(x => x.HeThongMa == heThongMa).Count();
            return Ok(count + 1);
        }

        /// <summary>
        /// API lưu thông tin minh chứng
        /// </summary>
        /// <param name="data">Nội dung minh chứng cần lưu</param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/MinhChung/LuuMinhChung")]
        public IHttpActionResult Save([FromBody] tblMinhChung data)
        {
            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Id == null || data.Id == 0)
            {
                db.tblMinhChungs.Add(data);
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
        /// Validate dữ liệu trước khi lưu
        /// </summary>
        /// <param name="data"></param>
        private void Validate(tblMinhChung data)
        {
            if (data.IdTieuChi == 0)
            {
                ModelState.AddModelError("IdTieuChi", "Tiêu chí bắt buộc chọn");
                ModelState.AddModelError("IdTieuChi", "has-error");
            }
            if (string.IsNullOrEmpty(data.HeThongMa))
            {
                ModelState.AddModelError("HeThongMa", "Hệ thống mã bắt buộc chọn");
                ModelState.AddModelError("HeThongMa", "has-error");
            }
            if (string.IsNullOrEmpty(data.TenMinhChung))
            {
                ModelState.AddModelError("TenMinhChung", "Tên minh chứng bắt buộc nhập");
                ModelState.AddModelError("TenMinhChung", "has-error");
            }
        }

    }
}
