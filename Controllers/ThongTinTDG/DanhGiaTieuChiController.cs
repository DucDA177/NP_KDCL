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
    public class DanhGiaTieuChiController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/DanhGiaTieuChi/GetDGTC")]
        public IHttpActionResult GetDGTC(int IdDonVi, int IdKeHoachTDG,int IdTieuChuan)
        {
           var data = from tchi  in db.DMTieuChis
                      .Where(x => x.IdTieuChuan == IdTieuChuan && x.IdDonVi == IdDonVi && x.YCDanhGia == true)
                      join dgtc in db.tblDanhGiaTieuChis
                      .Where(x => x.IdDonVi == IdDonVi && x.IdKeHoachTDG == IdKeHoachTDG)
                      on tchi.Id equals dgtc.IdTieuChi
                      into _dgtc
                      from dgtc in _dgtc.DefaultIfEmpty()
                      select new { dgtc, tchi };

            return Ok(data);
        }

        [HttpPost]
        [Route("api/DanhGiaTieuChi/Save")]
        public IHttpActionResult Save([FromBody] tblDanhGiaTieuChi data)
        {

            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Id == 0)
            {
                db.tblDanhGiaTieuChis.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);

        }

        [HttpGet]
        [Route("api/DanhGiaTieuChi/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblDanhGiaTieuChis.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblDanhGiaTieuChis.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }
    }
}
