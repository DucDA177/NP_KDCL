using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
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
        public IHttpActionResult GetDGTC(int IdDonVi, int IdKeHoachTDG, int IdTieuChuan)
        {
            var data = from tchi in db.DMTieuChis
                       .Where(x => x.IdTieuChuan == IdTieuChuan && x.YCDanhGia == true)
                       join dgtc in db.tblDanhGiaTieuChis
                       .Where(x => x.IdDonVi == IdDonVi && x.IdKeHoachTDG == IdKeHoachTDG)
                       on tchi.Id equals dgtc.IdTieuChi
                       into _dgtc
                       from dgtc in _dgtc.DefaultIfEmpty()
                       select new { dgtc, tchi };

            return Ok(data);
        }

        [HttpGet]
        [Route("api/DanhGiaTieuChi/GetByIdKeHoach")]
        public IHttpActionResult GetByIdKeHoach(int IdDonVi, int IdKeHoach, int IdTieuChi)
        {
            var data = db.tblDanhGiaTieuChis.Where(s => (s.IdDonVi == IdDonVi || IdDonVi == 0) && (s.IdKeHoachTDG == IdKeHoach || IdKeHoach == 0) && (s.IdTieuChi == IdTieuChi || IdTieuChi == 0));
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
        [Route("api/DanhGiaTieuChi/SaveKQTDG")]
        public IHttpActionResult SaveKQTDG(int IdDonVi, int IdKeHoachTDG, int KQDatMuc)
        {
            var data = db.tblDanhGiaTieuChis.Where(t => t.IdDonVi == IdDonVi && t.IdKeHoachTDG == IdKeHoachTDG).ToList();
            foreach (var item in data)
            {
                item.KQDatMuc = KQDatMuc;
            }
            return Ok(db.SaveChanges());

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

        [HttpGet]
        [Route("api/DanhGiaTieuChi/LoadKHTDGCapDuoi")]
        public IHttpActionResult LoadKHTDGCapDuoi(int IdDonViCapTren, string NamHoc)
        {
            if (string.IsNullOrEmpty(NamHoc))
                return Ok();

            var NamHocBD = Convert.ToInt32(NamHoc.Split('-').First());
            var NamHocKT = Convert.ToInt32(NamHoc.Split('-').Last());

            var data = (from dv in db.DMDonVis
                        join tdg in db.tblKeHoachTDGs
                        .Where(tdg => tdg.NamHocBD <= NamHocBD && tdg.NamHocKT >= NamHocKT)
                        on dv.Id equals tdg.IdDonVi
                        into _tdg
                        from tdg in _tdg.DefaultIfEmpty()
                        where dv.IDDVCha == IdDonViCapTren
                        && dv.FInUse == true
                        select new
                        {
                            dv,
                            tdg
                        }).OrderBy(t => t.dv.TenDonVi);

            return Ok(data);

        }

        [HttpPost]
        [Route("api/DanhGiaTieuChi/SaveNoiHam")]
        public IHttpActionResult SaveNoiHam([FromBody] NoiHamGDTC data)
        {
            var dgtc = db.tblDanhGiaTieuChis.Where(x => x.IdDonVi == data.IdDonVi
            && x.IdKeHoachTDG == data.IdKeHoachTDG && x.IdTieuChi == data.IdTieuChi)
                .AsNoTracking().FirstOrDefault();

            if (dgtc == null)
            {
                dgtc = new tblDanhGiaTieuChi();
                dgtc.IdDonVi = data.IdDonVi;
                dgtc.IdKeHoachTDG = data.IdKeHoachTDG;
                dgtc.IdTieuChi = data.IdTieuChi;
                dgtc.NoiHam = data.NoiHam;
            }
            else
            {
                dgtc.NoiHam = data.NoiHam;
            }

            Save(dgtc);

            return Ok(data);

        }

        public class NoiHamGDTC
        {
            public string NoiHam { get; set; }
            public int IdDonVi { get; set; }
            public int IdKeHoachTDG { get; set; }
            public int IdTieuChi { get; set; }
        }
    }
}
