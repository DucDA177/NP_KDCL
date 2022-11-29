using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Controllers.ThongTinTDG;
using WebApiCore.Models;
using static WebApiCore.Controllers.KeHoachDGN.HoiDongDGNController;

namespace WebApiCore.Controllers.BaoCaoDGN
{
    public class KetQuaNghienCuuDGNController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/KetQuaNghienCuuDGN/LoadKQNghienCuuTieuChiDGN")]
        public IHttpActionResult LoadKQNghienCuuTieuChiDGN(int IdDonVi, int IdKeHoachDGN, int IdTieuChi)
        {
            var result = db.tblKQNghienCuuTieuChiDGNs
                .Where(t =>
                t.IdTieuChi == IdTieuChi
                && t.IdKeHoachDGN == IdKeHoachDGN
                && t.IdDonVi == IdDonVi
                && t.FInUse == true)
                .FirstOrDefault();

            return Ok(result);
        }

        [HttpGet]
        [Route("api/KetQuaNghienCuuDGN/LoadMinhChung")]
        public IHttpActionResult LoadMinhChung(int IdKeHoachTDG, int IdTieuChi)
        {
            var result = db.tblMinhChungs.Where(t => t.IdTieuChi == IdTieuChi && t.IdKeHoachTDG == IdKeHoachTDG
           && t.FInUse == true).OrderBy(t => t.Ma).ToList();

            return Ok(result);
        }

        [HttpPost]
        [Route("api/KetQuaNghienCuuDGN/SaveBoSungTC")]
        public IHttpActionResult SaveBoSungTC([FromBody] tblKQNghienCuuTieuChiDGN data)
        {
            //var checkExist = db.tblKQNghienCuuTieuChiDGNs.Where(x => x.IdDonVi == data.IdDonVi
            //&& x.IdKeHoachDGN == data.IdKeHoachDGN && x.IdTieuChi == data.IdTieuChi).FirstOrDefault();
            //if (checkExist != null)
            //    db.tblKQNghienCuuTieuChiDGNs.Remove(checkExist);

            if (data.Id == 0)
            {
                db.tblKQNghienCuuTieuChiDGNs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }

            return Ok(data);

        }
    }
}
