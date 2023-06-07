using DocumentFormat.OpenXml.Office2010.Excel;
using Remotion.Collections;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;
using static WebApiCore.Controllers.DonViController;

namespace WebApiCore.Controllers.KeHoachTDG
{
    [Authorize]
    public class KeHoachTDGController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();



        [HttpGet]
        [Route("api/KeHoachTDG/GetAll")]
        public IHttpActionResult GetAll(int IdDonVi)
        {
            var data = db.tblKeHoachTDGs.Where(t => t.IdDonVi == IdDonVi)
                .OrderByDescending(t => t.NamHocKT);
            return Ok(data);
        }

        [HttpGet]
        [Route("api/KeHoachTDG/LoadListNamHoc")]
        [AllowAnonymous]
        public IHttpActionResult LoadListNamHoc()
        {
            var maxNamHocKT = db.tblKeHoachTDGs.Max(t => t.NamHocKT);
            var minNamHocBD = db.tblKeHoachTDGs.Min(t => t.NamHocBD);
            List<string> data = new List<string>();
            for (int i = maxNamHocKT; i >= minNamHocBD - 2; i--)
            {
                string namHoc = (i - 1) + " - " + i;
                data.Add(namHoc);
            }

            return Ok(data);
        }

        [HttpGet]
        [Route("api/KeHoachTDG/LoadKeHoachTDGHienTai")]
        public IHttpActionResult LoadKeHoachTDGHienTai(string NamHoc, int IdDonVi)
        {
            if (string.IsNullOrEmpty(NamHoc))
                return Ok();

            var NamHocBD = Convert.ToInt32(NamHoc.Split('-').First());
            var NamHocKT = Convert.ToInt32(NamHoc.Split('-').Last());

            var data = db.tblKeHoachTDGs.Where(t => t.IdDonVi == IdDonVi
            && t.NamHocBD <= NamHocBD && t.NamHocKT >= NamHocKT && t.TrangThai == "DTH")
                .OrderByDescending(t => t.NamHocKT)
                .FirstOrDefault();

            return Ok(data);
        }

        [HttpPost]
        [Route("api/KeHoachTDG/Save")]
        public IHttpActionResult Save([FromBody] tblKeHoachTDG data, bool? isTrangThaiChange)
        {

            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Id == null || data.Id == 0)
            {
                var checkKHTDG = db.tblKeHoachTDGs.Where(t => t.IdDonVi == data.IdDonVi && t.NamHocBD <= data.NamHocBD && t.NamHocKT >= data.NamHocKT).Any();
                if (checkKHTDG)
                    return BadRequest("Giai đoạn " + data.NamHocBD + " - " + data.NamHocKT + " đã tồn tại kế hoạch tự đánh giá");

                db.tblKeHoachTDGs.Add(data);
                db.SaveChanges();
            }
            else
            {
                if (data.TrangThai == "DTH" && isTrangThaiChange == true && data.DaBatDau != true)
                    CloneDataForDonVi(data);

                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);

        }
        [HttpPost]
        [Route("api/KeHoachTDG/ChuyenKeHoach")]
        public IHttpActionResult ChuyenKeHoach([FromBody] tblKeHoachTDG data)
        {

            

            if (data.Id > 0)
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();
            }
            return Ok(data);

        }
        private void CloneDataForDonVi(tblKeHoachTDG data)
        {
            var dvHienTai = db.DMDonVis.Find(data.IdDonVi);
            var dvGoc = db.DMDonVis.FirstOrDefault(x => x.Id == dvHienTai.IdDonViGoc);
            if (dvGoc == null)
                return;

            //Clone DanhGiaTieuChi
            var listDGTC = db.tblDanhGiaTieuChis.Where(x => x.IdDonVi == dvGoc.Id)
                .AsEnumerable().Select(x =>
                {
                    x.Id = 0;
                    x.IdDonVi = dvHienTai.Id;
                    x.IdKeHoachTDG = data.Id;
                    return x;
                });
            db.tblDanhGiaTieuChis.AddRange(listDGTC);

            //Clone DuLieuNhaTruong
            var listDLNT = db.tblDuLieuNhaTruongs.Where(x => x.IdDonVi == dvGoc.Id)
                .AsEnumerable().Select(x =>
                {
                    x.Id = 0;
                    x.IdDonVi = dvHienTai.Id;
                    x.IdKeHoachTDG = data.Id;
                    return x;
                });
            db.tblDuLieuNhaTruongs.AddRange(listDLNT);

            //Clone MinhChung
            var listMC = db.tblMinhChungs.Where(x => x.IdDonVi == dvGoc.Id)
               .AsEnumerable().Select(x =>
               {
                   x.Id = 0;
                   x.IdDonVi = dvHienTai.Id;
                   x.IdKeHoachTDG = data.Id;
                   return x;
               });
            db.tblMinhChungs.AddRange(listMC);

            //Clone MoDauKetLuanTC
            var listKLTC = db.tblMoDauKetLuanTCs.Where(x => x.IdDonVi == dvGoc.Id)
               .AsEnumerable().Select(x =>
               {
                   x.Id = 0;
                   x.IdDonVi = dvHienTai.Id;
                   x.IdKeHoachTDG = data.Id;
                   return x;
               });
            db.tblMoDauKetLuanTCs.AddRange(listKLTC);
        }
        private void Validate(tblKeHoachTDG item)
        {
            if (string.IsNullOrEmpty(item.NoiDung))
            {
                ModelState.AddModelError("NoiDung", "Nội dung bắt buộc nhập");
                ModelState.AddModelError("NoiDung", "has-error");
            }
            if (item.NgayBD == null)
            {
                ModelState.AddModelError("NgayBD", "Ngày bắt đầu bắt buộc nhập");
                ModelState.AddModelError("NgayBD", "has-error");
            }
            if (item.NgayKT == null)
            {
                ModelState.AddModelError("NgayKT", "Ngày kết thúc bắt buộc nhập");
                ModelState.AddModelError("NgayKT", "has-error");
            }
            if (item.NamHocBD == 0 || item.NamHocKT == 0)
            {
                ModelState.AddModelError("NamHoc", "Năm học bắt buộc nhập");
                ModelState.AddModelError("NamHoc", "has-error");
            }
            if (item.IdQuyDinhTC == null || item.IdQuyDinhTC == 0)
            {
                ModelState.AddModelError("IdQuyDinhTC", "Quy định tiêu chuẩn bắt buộc nhập");
                ModelState.AddModelError("IdQuyDinhTC", "has-error");
            }
        }

        [HttpGet]
        [Route("api/KeHoachTDG/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblKeHoachTDGs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblKeHoachTDGs.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }

        [HttpGet]
        [Route("api/KeHoachTDG/GetDonViVaKeHoachTDG")]
        [AllowAnonymous]
        public IHttpActionResult GetDonViVaKeHoachTDG(string MaDonVi)
        {
            var dv = db.DMDonVis.Where(t => t.MaDonVi == MaDonVi).FirstOrDefault();
            var kh = new tblKeHoachTDG();

            if (dv != null)
            {
                kh = db.tblKeHoachTDGs.Where(t => t.IdDonVi == dv.Id && t.TrangThai == "DTH")
                .OrderByDescending(t => t.NamHocKT)
                .FirstOrDefault();
            }

            return Ok(new { dv, kh });

        }
        public class FilterKHTDG : FilterModel
        {
            public int? IdKeHoach { get; set; }
            public int? IdKeHoachDGN { get; set; }
            public int? IdTruong { get; set; }
            public int? NamTu { get; set; }
            public int? NamDen { get; set; }
            public string TrangThai { get; set; }
            public string TrangThaiDGN { get; set; }
            public bool? ChuyenKeHoach { get; set; }
        }
        public class KeHoachTDGModel: tblKeHoachTDG
        {
            public long? IdKeHoachDGN { get; set; }
            public string DonViName { get; set; }
            public string KeHoachTDGName { get; set; }
            public string TrangThaiKeHoachDGN { get; set; }
        }
        [HttpPost]
        [Route("api/KeHoachTDG/FilterKeHoachTDG")]
        public IHttpActionResult FilterKeHoachTDG(FilterKHTDG filter)
        {
            try
            {
                var listKeHoach = (from kh in db.tblKeHoachTDGs
                                   join dv in db.DMDonVis on kh.IdDonVi equals dv.Id
                                   join khdgn in db.tblKeHoachDGNs on kh.Id equals khdgn.IdKeHoachTDG into tmpKHDGN
                                   from khdgn in tmpKHDGN.DefaultIfEmpty()
                                   where kh.FInUse == true
                                   select //kh
                                   new KeHoachTDGModel
                                   {
                                       Id=kh.Id,
                                       STT=kh.STT,
                                       IdDonVi = kh.IdDonVi,
                                       IdQuyDinhTC = kh.IdQuyDinhTC,
                                       NgayBD = kh.NgayBD,
                                       NgayKT = kh.NgayKT,
                                       NamHocBD = kh.NamHocBD,
                                       NamHocKT = kh.NamHocKT,
                                       NoiDung = kh.NoiDung,
                                       TrangThai = kh.TrangThai,
                                       MucDich = kh.MucDich,
                                       PhamVi = kh.PhamVi,
                                       CongCu = kh.CongCu,
                                       TapHuanNghiepVu = kh.TapHuanNghiepVu,
                                       NguonLuc = kh.NguonLuc,
                                       ThueChuyenGia = kh.ThueChuyenGia,
                                        BangDanhMuc = kh.BangDanhMuc,
                                       ThoiGianHoatDong = kh.ThoiGianHoatDong,
                                       GhiChu = kh.GhiChu,
                                       ChuyenKeHoach = kh.ChuyenKeHoach,
                                        CreatedAt=kh.CreatedAt,
                                       CreatedBy=kh.CreatedBy,
                                       UpdatedAt=kh.UpdatedAt,
                                       UpdatedBy=kh.UpdatedBy,
                                       FInUse=kh.FInUse,
                                       IdKeHoachDGN = khdgn.Id,
                                       DonViName = dv.TenDonVi,
                                       KeHoachTDGName = kh.NoiDung,
                                       TrangThaiKeHoachDGN=khdgn.TrangThai,
                                       DaBatDau = kh.DaBatDau,
                                   }
                                   );
                if (!string.IsNullOrWhiteSpace(filter.SearchKey))
                {
                    listKeHoach = listKeHoach.Where(s => s.NoiDung.Contains(filter.SearchKey));
                }
                if (!string.IsNullOrWhiteSpace(filter.TrangThai))
                {
                    listKeHoach = listKeHoach.Where(s => s.TrangThai==filter.TrangThai );
                }
                if (!string.IsNullOrWhiteSpace(filter.TrangThaiDGN))
                {
                    listKeHoach = listKeHoach.Where(s => s.TrangThaiKeHoachDGN == filter.TrangThaiDGN);
                }
                if (filter.IdKeHoach.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.Id == filter.IdKeHoach);
                }
                if (filter.IdKeHoachDGN.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.IdKeHoachDGN == filter.IdKeHoachDGN);
                }
                if (filter.ChuyenKeHoach.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.ChuyenKeHoach == filter.ChuyenKeHoach.Value);
                }
                if (filter.IdTruong.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.IdDonVi == filter.IdTruong);
                }
                if (filter.NamTu.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s =>( s.NamHocBD<=filter.NamTu ||(s.NamHocBD > filter.NamTu && (!filter.NamDen.HasValue|| s.NamHocBD < filter.NamDen))) && s.NamHocKT>filter.NamTu);
                }
                if (filter.NamDen.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.NamHocBD<=filter.NamDen && (s.NamHocKT>=filter.NamDen ||(s.NamHocKT < filter.NamDen && filter.NamTu.HasValue && filter.NamTu<s.NamHocKT)));
                }
                listKeHoach = listKeHoach.OrderBy(s => s.Id);
                if (filter.GetAll.HasValue && filter.GetAll == true)
                {
                    return Ok(new { ListOut = listKeHoach });
                }
                return Ok(Commons.Common.GetPagingList(listKeHoach, filter.PageNumber, filter.PageSize));
            }
            catch (Exception ex)
            {
                Commons.Common.WriteLogToTextFile(ex.ToString());
                return null;
            }

        }

    }
}
