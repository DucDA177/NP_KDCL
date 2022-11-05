using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;
using static WebApiCore.Controllers.UserProfilesController;

namespace WebApiCore.Controllers.KeHoachTDG
{
    [Authorize]
    public class NhomCongTacController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/NhomCongTac/Get")]
        public IHttpActionResult Get(int IdDonVi, int IdKeHoachTDG)
        {
            var data = db.tblNhomCongTacs.Where(x => x.IdDonVi == IdDonVi
            && x.IdKeHoachTDG == IdKeHoachTDG);
            return Ok(data);
        }

        [HttpGet]
        [Route("api/NhomCongTac/GetThanhVien")]
        public IHttpActionResult GetThanhVien(int IdNhom)
        {
            var data = db.tblThanhVienNhoms.Where(x => x.IdNhom == IdNhom);
            return Ok(data);
        }

        [HttpGet]
        [Route("api/NhomCongTac/GetAllThanhVienNhiemVu")]
        public IHttpActionResult GetAllThanhVienNhiemVu(int IdDonVi, int IdKeHoachTDG)
        {
            var data = (from tv in db.tblThanhVienNhoms
                       join nhom in db.tblNhomCongTacs
                       on tv.IdNhom equals nhom.Id
                       join hd in db.tblHoiDongs
                       on tv.IdHoiDong equals hd.Id
                       join user in db.UserProfiles
                       on hd.Username equals user.UserName
                       where nhom.IdDonVi == IdDonVi && nhom.IdKeHoachTDG == IdKeHoachTDG
                       && hd.FInUse == true && user.FInUse == true
                       select new
                       {
                           IdNhom = nhom.Id,
                           TenNhom = nhom.TenNhom,
                           HoTen = user.HoTen,
                           ChucVu = tv.IdChucVu == 1 ? "Nhóm trưởng" : "Thành viên",
                           NhiemVu = nhom.NhiemVu
                       }).OrderBy(t => t.TenNhom).
                       ThenBy(x => x.ChucVu).
                       ThenBy(x => x.HoTen);

            return Ok(data);
        }

        [HttpGet]
        [Route("api/NhomCongTac/GetTieuChiCacNhom")]
        public IHttpActionResult GetTieuChiCacNhom(int IdDonVi, int IdKeHoachTDG)
        {
            var data = (from pctc in db.tblPhanCongTCs
                       join nhom in db.tblNhomCongTacs
                       on pctc.IdNhom equals nhom.Id
                       join tc in db.DMTieuChis
                       on pctc.IdTieuChi equals tc.Id
                       join tchuan in db.DMTieuChuans
                       on tc.IdTieuChuan equals tchuan.Id
                       where pctc.IdDonVi == IdDonVi && pctc.IdKeHoachTDG == IdKeHoachTDG
                       select new
                       {
                           TTTieuChuan = tchuan.ThuTu,
                           TTTieuChi = tc.ThuTu,
                           IdTieuChi = pctc.IdTieuChi,
                           TenTieuChi = tc.NoiDung,
                           IdNhom = nhom.Id,
                           TenNhom = nhom.TenNhom
                       }).GroupBy(x => x.IdTieuChi)
                       .ToList().Select(x => new
                       {
                           TTTieuChuan = x.FirstOrDefault().TTTieuChuan,
                           TTTieuChi = x.FirstOrDefault().TTTieuChi,
                           TenTieuChi = x.FirstOrDefault().TenTieuChi,
                           TenNhom = x.Select(c =>c.TenNhom).Aggregate((i, j) => i + "</br>" + j)
                       });

            return Ok(data);
        }

        [HttpPost]
        [Route("api/NhomCongTac/Save")]
        public IHttpActionResult Save([FromBody] NhomCongTacRequestModel data)
        {

            Validate(data.tblNhomCongTac);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.tblNhomCongTac.Id == 0)
            {
                db.tblNhomCongTacs.Add(data.tblNhomCongTac);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data.tblNhomCongTac).State = EntityState.Modified;
                db.SaveChanges();

            }
            var listTvClear = db.tblThanhVienNhoms.Where(x => x.IdNhom == data.tblNhomCongTac.Id);
            if (listTvClear.Any())
            {
                db.tblThanhVienNhoms.RemoveRange(listTvClear);
                db.SaveChanges();
            }

            data.thanhVienNhoms.ForEach(x =>
            {
                x.IdNhom = data.tblNhomCongTac.Id;
            });
            db.tblThanhVienNhoms.AddRange(data.thanhVienNhoms);


            var listTcClear = db.tblPhanCongTCs.Where(x => x.IdNhom == data.tblNhomCongTac.Id);
            if (listTcClear.Any())
            {
                db.tblPhanCongTCs.RemoveRange(listTcClear);
                db.SaveChanges();
            }
            List<tblPhanCongTC> phanCongTCs = new List<tblPhanCongTC>();
            data.listTieuChi.ForEach(x =>
            {
                tblPhanCongTC tblPhanCongTC = new tblPhanCongTC();
                tblPhanCongTC.IdDonVi = data.tblNhomCongTac.IdDonVi;
                tblPhanCongTC.IdKeHoachTDG = data.tblNhomCongTac.IdKeHoachTDG;
                tblPhanCongTC.IdNhom = data.tblNhomCongTac.Id;
                tblPhanCongTC.IdTieuChi = x;

                phanCongTCs.Add(tblPhanCongTC);

            });
            db.tblPhanCongTCs.AddRange(phanCongTCs);


            db.SaveChanges();

            return Ok(data);

        }

        [HttpGet]
        [Route("api/NhomCongTac/Del")]
        public IHttpActionResult Del(int IdNhom)
        {
            var data = db.tblNhomCongTacs.Find(IdNhom);
            db.tblNhomCongTacs.Remove(data);

            var listTv = db.tblThanhVienNhoms.Where(x => x.IdNhom == IdNhom);
            if (listTv.Any())
                db.tblThanhVienNhoms.RemoveRange(listTv);

            return Ok(db.SaveChanges());
        }

        private void Validate(tblNhomCongTac item)
        {
            if (string.IsNullOrEmpty(item.TenNhom))
            {
                ModelState.AddModelError("TenNhom", "Tên nhóm bắt buộc nhập");
                ModelState.AddModelError("TenNhom", "has-error");
            }
            if (string.IsNullOrEmpty(item.NhiemVu))
            {
                ModelState.AddModelError("NhiemVu", "Nhiệm vụ bắt buộc nhập");
                ModelState.AddModelError("NhiemVu", "has-error");
            }
        }
        public class NhomCongTacRequestModel
        {
            public tblNhomCongTac tblNhomCongTac { get; set; }
            public List<tblThanhVienNhom> thanhVienNhoms { get; set; }
            public List<int> listTieuChi { get; set; }
        }

        [HttpGet]
        [Route("api/NhomCongTac/LoadTieuChuanTieuChi")]
        public IHttpActionResult LoadTieuChuanTieuChi(int idQuyDinh, int idNhom, int idKeHoachTDG)
        {
            var result = new List<DSTieuChuanTieuChiClient>();
            //var user = db.UserProfiles.Find(userId);
            var dv = db.DMDonVis.Find(Commons.Common.GetCurrentDonVi(db));

            var listTieuChiId = db.tblPhanCongTCs.Where(t =>
            t.IdDonVi == dv.Id && t.IdKeHoachTDG == idKeHoachTDG && t.IdNhom == idNhom)
                .Select(t => t.IdTieuChi).ToList();

            var dsTieuChuan = db.DMTieuChuans
                .Where(x => x.IdQuyDinh == idQuyDinh && x.NhomLoai.Contains(dv.NhomLoai)).OrderBy(t => t.ThuTu);
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
                    tc.IsCheck = listTieuChiId.Contains(tchi.Id);
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

        [HttpGet]
        [Route("api/NhomCongTac/GetNhomByTieuChi")]
        public IHttpActionResult GetNhomByTieuChi(int IdDonVi, int IdKeHoachTDG, int IdTieuChi)
        {
           var data = (from pctc in db.tblPhanCongTCs
                      join nhom in db.tblNhomCongTacs 
                      on pctc.IdNhom equals nhom.Id
                      where pctc.IdDonVi == IdDonVi && pctc.IdKeHoachTDG == IdKeHoachTDG
                      && pctc.IdTieuChi == IdTieuChi
                      select nhom).FirstOrDefault();

            return Ok(data);
        }
    }
}
