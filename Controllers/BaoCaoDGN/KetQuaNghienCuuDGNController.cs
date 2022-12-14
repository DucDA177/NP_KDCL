using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
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

                var orignEntity = db.tblKQNghienCuuTieuChiDGNs.Where(x => x.Id == data.Id).AsNoTracking().FirstOrDefault();
                if (orignEntity.ChuaDG != data.ChuaDG
                    || orignEntity.ChuaDGDung != data.ChuaDGDung
                    || orignEntity.ChuaDGDayDu != data.ChuaDGDayDu
                    || orignEntity.MCKiemTra != data.MCKiemTra
                    || orignEntity.MCBoSung != data.MCBoSung
                    || orignEntity.DoiTuongPV != data.DoiTuongPV
                    || orignEntity.SoLuong != data.SoLuong
                    || orignEntity.NoiDungPV != data.NoiDungPV
                    || orignEntity.GhiChu != data.GhiChu
                    )
                {
                    var tchi = db.DMTieuChis.Find(data.IdTieuChi);
                    var khDGN = db.tblKeHoachDGNs.Find(data.IdKeHoachDGN);
                    ThongBao tb = new ThongBao();
                    tb.DonViNhan = khDGN.IdTruong.ToString();
                    //tb.Link = "TNTTCT";
                    tb.NgayGui = DateTime.Now;
                    tb.NguoiGui = HttpContext.Current.User.Identity.Name;
                    tb.NoiDung = "Cấp trên vừa đánh giá ngoài với tiêu chí <i>" + tchi.NoiDung + "</i>";
                    tb.ChiTiet = "<div>- Chưa đánh giá: " + (data.ChuaDG.Value ? "X" : "") + "</div></br>"
                        + "<div>- Chưa đánh giá đúng: " + (data.ChuaDGDung.Value ? "X" : "") + "</div></br>"
                        + "<div>- Chưa đánh giá đầy đủ: " + (data.ChuaDGDayDu.Value ? "X" : "") + "</div></br>"
                        + "<div>- Minh chứng cần kiểm tra: " + data.MCKiemTra + "</div></br>"
                        + "<div>- Minh chứng cần bổ sung: " + data.MCBoSung + "</div></br>"
                        + "<div>- Đối tượng cần phỏng vấn: " + data.DoiTuongPV + "</div></br>"
                        + "<div>- Số lượng: " + data.SoLuong + "</div></br>"
                        + "<div>- Nội dung phỏng vấn: " + data.NoiDungPV + "</div></br>"
                        + "<div>- Nội dung bổ sung: " + data.GhiChu + "</div></br>";
                    tb.Loai = 1;

                    db.ThongBaos.Add(tb);
                }

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
                                MCKiemTra = kqtc.MCKiemTra.Replace("[", "").Replace("]", "").Replace(",", "; ").Replace("\"", ""),
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
