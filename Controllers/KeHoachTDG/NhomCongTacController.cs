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
            if(listTv.Any())
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
                .Where(x => x.IdQuyDinh == idQuyDinh && x.NhomLoai.Contains(dv.NhomLoai)).OrderBy(t => t.STT);
            int index = 1;
            foreach (var item in dsTieuChuan)
            {
                DSTieuChuanTieuChiClient tchuan = new DSTieuChuanTieuChiClient();
                tchuan.DuLieuCha = true;
                tchuan.Id = item.Id;
                tchuan.Index = index;
                tchuan.LoaiDuLieu = 1;
                tchuan.NoiDung = item.NoiDung;
                index++;

                var tchis = db.DMTieuChis.Where(x => x.IdTieuChuan == item.Id);
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
