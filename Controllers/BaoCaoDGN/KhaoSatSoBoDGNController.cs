using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Controllers.KeHoachDGN;
using WebApiCore.Controllers.KeHoachTDG;
using WebApiCore.Models;
using static WebApiCore.Controllers.KeHoachDGN.HoiDongDGNController;

namespace WebApiCore.Controllers.BaoCaoDGN
{
    public class KhaoSatSoBoDGNController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/KhaoSatSoBoDGN/Get")]
        public IHttpActionResult Get(int IdDonVi, int IdKeHoachDGN)
        {
            var data = db.tblKhaoSatSoBoDGNs.Where(x => x.IdDonVi == IdDonVi && x.IdKeHoachDGN == IdKeHoachDGN)
                .FirstOrDefault();
            return Ok(data);
        }

        [HttpPost]
        [Route("api/KhaoSatSoBoDGN/Save")]
        public IHttpActionResult Save([FromBody] tblKhaoSatSoBoDGN data)
        {

            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Id == 0)
            {
                db.tblKhaoSatSoBoDGNs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();
            }

            return Ok(data);

        }
        [HttpPost]
        [Route("api/KhaoSatSoBoDGN/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblKhaoSatSoBoDGNs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblKhaoSatSoBoDGNs.Remove(dt);

            db.SaveChanges();
            return Ok(dt);

        }

        [HttpGet]
        [Route("api/KhaoSatSoBoDGN/LoadBienBan")]
        public IHttpActionResult LoadBienBan(int IdDonVi, int IdKeHoachDGN)
        {
            HoiDongDGNController hdDGN = new HoiDongDGNController();
            var DGN = hdDGN.GetAll(IdDonVi, IdKeHoachDGN);

            var khDGN = db.tblKeHoachDGNs.Find(IdKeHoachDGN);

            HoiDongController hdTDG = new HoiDongController();

            var TDG = hdTDG.GetAll(khDGN.IdTruong.Value, khDGN.IdKeHoachTDG.Value);

            var BienBan = db.tblKhaoSatSoBoDGNs.Where(x => x.IdDonVi == IdDonVi && x.IdKeHoachDGN == IdKeHoachDGN).FirstOrDefault();
            var Truong = db.DMDonVis.Find(khDGN.IdTruong.Value);

            return Ok(new { DGN, TDG, BienBan, Truong });
        }
    }
}
