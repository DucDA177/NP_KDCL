using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Controllers.KeHoachTDG;
using WebApiCore.Controllers.ThongTinTDG;
using WebApiCore.Models;
using static WebApiCore.Controllers.KeHoachDGN.HoiDongDGNController;

namespace WebApiCore.Controllers.BaoCaoDGN
{
    public class KetQuaNghienCuuDGNController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/KetQuaNghienCuuDGN/Get")]
        public IHttpActionResult GetKetQuaNghienCuuDGN(int IdDonVi, int IdKeHoachDGN)
        {
            var result = db.tblKetQuaNghienCuuDGNs
                .Where(t =>
                t.IdKeHoachDGN == IdKeHoachDGN
                && t.IdDonVi == IdDonVi
                && t.FInUse == true)
                .FirstOrDefault();

            return Ok(result);
        }

        [HttpPost]
        [Route("api/KetQuaNghienCuuDGN/Save")]
        public IHttpActionResult Save([FromBody] tblKetQuaNghienCuuDGN data)
        {

            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Id == 0)
            {
                db.tblKetQuaNghienCuuDGNs.Add(data);
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
        [Route("api/KetQuaNghienCuuDGN/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblKetQuaNghienCuuDGNs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblKetQuaNghienCuuDGNs.Remove(dt);

            db.SaveChanges();
            return Ok(dt);

        }


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

        [HttpGet]
        [Route("api/KetQuaNghienCuuDGN/LoadBaoCao")]
        public IHttpActionResult LoadBaoCao(int IdDonVi, int IdKeHoachDGN)
        {
            var khDGN = db.tblKeHoachDGNs.Find(IdKeHoachDGN);

            var BaoCao = db.tblKetQuaNghienCuuDGNs.Where(x => x.IdDonVi == IdDonVi && x.IdKeHoachDGN == IdKeHoachDGN).FirstOrDefault();
            var Truong = db.DMDonVis.Find(khDGN.IdTruong.Value);
            var TieuChis = (from kqtc in db.tblKQNghienCuuTieuChiDGNs
                            join tchi in db.DMTieuChis
                            on kqtc.IdTieuChi equals tchi.Id
                            join tchuan in db.DMTieuChuans
                            on tchi.IdTieuChuan equals tchuan.Id
                            where kqtc.IdDonVi == IdDonVi && kqtc.IdKeHoachDGN == IdKeHoachDGN
                            select new
                            {
                                tchuan = tchuan.ThuTu,
                                tchi = tchi.ThuTu,
                                kqtc.ChuaDG,
                                kqtc.ChuaDGDung,
                                kqtc.ChuaDGDayDu,
                                MCKiemTra = kqtc.MCKiemTra.Replace("[","").Replace("]","").Replace(",","; ").Replace("\"", ""),
                                MCBoSung = kqtc.MCBoSung.Replace("[", "").Replace("]", "").Replace(",", "; ").Replace("\"", ""),
                                kqtc.DoiTuongPV,
                                kqtc.SoLuong,
                                kqtc.NoiDungPV,
                                kqtc.GhiChu
                            }).OrderBy(x => x.tchuan).ThenBy(x => x.tchi);


            return Ok(new { BaoCao, Truong, TieuChis });
        }
    }
}
