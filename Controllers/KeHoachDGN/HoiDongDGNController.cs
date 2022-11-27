using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;
using static WebApiCore.Controllers.UserProfilesController;

namespace WebApiCore.Controllers.KeHoachDGN
{
    [Authorize]
    public class HoiDongDGNController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [AllowAnonymous]
        [HttpGet]
        [Route("api/HoiDongDGN/GetAll")]
        public IHttpActionResult GetAll(int IdDonVi, int IdKeHoachDGN)
        {
            var data = (from hd in db.tblHoiDongDGNs
                        join cv in db.tblDanhmucs.Where(t => t.Maloai == "CHUCVU")
                        on hd.IdChucVu equals cv.Id
                        join nv in db.tblDanhmucs.Where(t => t.Maloai == "NHIEMVU")
                        on hd.IdNhiemVuDGN equals nv.Id
                        join us in db.UserProfiles
                        on hd.Username equals us.UserName
                        where hd.IdDonVi == IdDonVi && hd.IdKeHoachDGN == IdKeHoachDGN
                        select new { hd, cv, nv, us }).OrderBy(x => x.hd.STT);
            return Ok(data);
        }

        public class HoiDongDGNRequest
        {
            public tblHoiDongDGN hd { get; set; }
            public List<int> listTC { get; set; }
        }
        [HttpPost]
        [Route("api/HoiDongDGN/Save")]
        public IHttpActionResult Save([FromBody] HoiDongDGNRequest data)
        {

            Validate(data.hd);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.hd.STT == 0)
            {
                var dt = db.tblHoiDongDGNs.Where(t => t.FInUse == true && t.IdDonVi == data.hd.IdDonVi
                && t.IdKeHoachDGN == data.hd.IdKeHoachDGN);
                if (dt != null && dt.Count() > 0)
                    data.hd.STT = dt.Max(t => t.STT) + 1;
                else data.hd.STT = 1;

            }

            if (data.hd.Id == 0)
            {
                db.tblHoiDongDGNs.Add(data.hd);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data.hd).State = EntityState.Modified;
                db.SaveChanges();

            }

            SavePhanCongTCDGN(data);

            return Ok(data);

        }
        private void Validate(tblHoiDongDGN item)
        {
            if (string.IsNullOrEmpty(item.Username))
            {
                ModelState.AddModelError("Username", "Họ và tên bắt buộc chọn");
                ModelState.AddModelError("Username", "has-error");
            }
            if (item.IdChucVu == null | item.IdChucVu == 0)
            {
                ModelState.AddModelError("IdChucVu", "Chức vụ bắt buộc nhập");
                ModelState.AddModelError("IdChucVu", "has-error");
            }
            if (item.IdNhiemVuDGN == null | item.IdNhiemVuDGN == 0)
            {
                ModelState.AddModelError("IdNhiemVuDGN", "Nhiệm vụ bắt buộc nhập");
                ModelState.AddModelError("IdNhiemVuDGN", "has-error");
            }
            
        }
        private void SavePhanCongTCDGN(HoiDongDGNRequest data)
        {
            var checkExistTC = db.tblPhanCongTCDGNs.Where(x => x.IdHoiDongDGN == data.hd.Id);
            if (checkExistTC.Any())
                db.tblPhanCongTCDGNs.RemoveRange(checkExistTC);
            foreach (var item in data.listTC)
            {
                tblPhanCongTCDGN tblPhanCongTCDGN = new tblPhanCongTCDGN();
                tblPhanCongTCDGN.IdHoiDongDGN = data.hd.Id;
                tblPhanCongTCDGN.IdTieuChi = item;
                db.tblPhanCongTCDGNs.Add(tblPhanCongTCDGN);
            }
            db.SaveChanges();

        }
        [HttpGet]
        [Route("api/HoiDongDGN/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblHoiDongDGNs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblHoiDongDGNs.Remove(dt);
            if (dt != null)
            {
                var dataTC = db.tblPhanCongTCDGNs.Where(
                t => t.IdHoiDongDGN == Id
                );
                if (dataTC.Any())
                    db.tblPhanCongTCDGNs.RemoveRange(dataTC);
            }

            db.SaveChanges();
            return Ok(dt);

        }

        [HttpGet]
        [Route("api/HoiDongDGN/LoadTVByUsername")]
        public IHttpActionResult LoadTVByUsername(string Username, int IdDonVi, int IdKeHoachDGN)
        {
            var dt = db.tblHoiDongDGNs
                .Where(t => t.FInUse == true && t.Username == Username
                && t.IdDonVi == IdDonVi && t.IdKeHoachDGN == IdKeHoachDGN)
                .FirstOrDefault();
           
            return Ok(dt);

        }

        [HttpGet]
        [Route("api/HoiDongDGN/LoadTieuChuanTieuChi")]
        public IHttpActionResult LoadTieuChuanTieuChi(int IdHoiDongDGN, int IdKeHoachDGN)
        {
            var result = new List<DSTieuChuanTieuChiClient>();
            var hdDGN = db.tblHoiDongDGNs.Find(IdHoiDongDGN);
            var khTDG = (from tdg in db.tblKeHoachTDGs
                        join dgn in db.tblKeHoachDGNs
                        on tdg.Id equals dgn.IdKeHoachTDG
                        select tdg).FirstOrDefault();

            if (khTDG == null)
                return NotFound();

            var dvTDG = db.DMDonVis.Find(khTDG.IdDonVi);

            var listTieuChiTaken = from pc in db.tblPhanCongTCDGNs
                                   join hd in db.tblHoiDongDGNs
                                   on pc.IdHoiDongDGN equals hd.Id
                                   where hd.IdKeHoachDGN == IdKeHoachDGN
                                   && pc.IdHoiDongDGN != IdHoiDongDGN
                                   select pc.IdTieuChi;

            var listTieuChiId = db.tblPhanCongTCDGNs.Where(t =>
            t.IdHoiDongDGN == IdHoiDongDGN)
                .Select(t => t.IdTieuChi).ToList();

            var dsTieuChuan = db.DMTieuChuans
                .Where(x => x.IdQuyDinh == khTDG.IdQuyDinhTC && x.NhomLoai.Contains(dvTDG.NhomLoai))
                .OrderBy(t => t.ThuTu);

            int index = 1;
            foreach (var item in dsTieuChuan)
            {
                var tchis = db.DMTieuChis.Where(x => x.IdTieuChuan == item.Id).OrderBy(t => t.ThuTu);

                DSTieuChuanTieuChiClient tchuan = new DSTieuChuanTieuChiClient();
                tchuan.DuLieuCha = true;
                tchuan.Id = item.Id;
                tchuan.Index = index;
                tchuan.LoaiDuLieu = 1;
                tchuan.NoiDung = item.NoiDung;
                tchuan.SLTieuChi = tchis.Count();
                tchuan.ThuTu = item.ThuTu.ToString();
                index++;


                if (!tchis.Any())
                    continue;

                foreach (var tchi in tchis)
                {
                    DSTieuChuanTieuChiClient tc = new DSTieuChuanTieuChiClient();
                    tc.DuLieuCha = false;
                    tc.Id = tchi.Id;
                    tc.IdChiTieuCha = item.Id;
                    tc.Index = index;
                    tc.IsCheck = listTieuChiId.Contains(tchi.Id) && !listTieuChiTaken.Contains(tchi.Id);
                    tc.IsTaken = listTieuChiTaken.Contains(tchi.Id);
                    tc.LoaiDuLieu = 2;
                    tc.NoiDung = tchi.NoiDung;
                    tc.ThuTu = item.ThuTu.ToString() + "." + tchi.ThuTu.ToString();

                    if (tchi.ThuTu == 1)
                        tc.SLTieuChi = tchuan.SLTieuChi;

                    result.Add(tc);
                    index++;

                    if (tc.IsCheck)
                        tchuan.IsCheck = true;
                }

                result.Add(tchuan);

            }

            return Ok(result.OrderBy(x => x.Index).ThenBy(x => x.LoaiDuLieu).ThenBy(x => x.NoiDung));
        }
    }
}
