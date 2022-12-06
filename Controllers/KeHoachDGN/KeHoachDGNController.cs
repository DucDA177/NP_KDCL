using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Models;
using static WebApiCore.Controllers.DanhMuc.DanhMucTieuChuanController;

namespace WebApiCore.Controllers.KeHoachDGN
{
    public class KeHoachDGNController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        public class FilterKHDGN : FilterModel
        {
            public int? IdKeHoach { get; set; }
            public int? IdKeHoachTDG { get; set; }
            public int? IdTruong { get; set; }
            public int? Nam { get; set; }
            public string TrangThai { get; set; }
            public bool? ChuyenKeHoach { get; set; }
            public bool? IsThanhVien { get; set; }
            public bool? TruongDoan { get; set; }
        }
        public class KeHoachDGNModel : tblKeHoachDGN
        {
            public string DonViName { get; set; }
            public string KeHoachTDGName { get; set; }
            public bool IsThanhVien { get; set; }
            public bool? TruongDoan { get; set; }
            public bool? ThuKy { get; set; }
            public bool? UyVien { get; set; }
        }
        [HttpPost]
        [Route("api/KeHoachDGN/FilterKHDGN")]
        public IHttpActionResult FilterKeHoachDGN(FilterKHDGN filter)
        {
            try
            {
                var listKeHoach = (from khtdg in db.tblKeHoachTDGs
                                   join khdgn in db.tblKeHoachDGNs on khtdg.Id equals khdgn.IdKeHoachTDG into tmpKHTDG
                                   from khdgn in tmpKHTDG.DefaultIfEmpty()
                                   join truongDGN in db.tblTruongDGNs on khtdg.Id equals truongDGN.IdKeHoachTDG into tmpTruongDGN
                                   from truongDGN in tmpTruongDGN.DefaultIfEmpty()
                                   join tv in db.tblThanhVienDGNs on new { truongDGN.Id, UserName = HttpContext.Current.User.Identity.Name } equals new { Id = tv.IdTruongDGN, UserName = tv.Username } into tmpTvDGN
                                   //   join tv in db.tblThanhVienDGNs on truongDGN.Id equals tv.IdTruongDGN into tmpTvDGN
                                   from tv in tmpTvDGN.DefaultIfEmpty()
                                   join doan in db.tblDoanDGNs on truongDGN.IdDoanDGN equals doan.Id into tmpDoanDGN
                                   from doan in tmpDoanDGN.DefaultIfEmpty()
                                   join dv in db.DMDonVis on khtdg.IdDonVi equals dv.Id
                                   where khtdg.ChuyenKeHoach == true && khtdg.TrangThai == "DTH" 
                                   select //kh
                                   new KeHoachDGNModel
                                   {
                                       Id = khdgn != null ? khdgn.Id : 0,
                                       STT = khdgn != null ? khdgn.STT : 0,
                                       IdDonVi = khdgn != null ? khdgn.IdDonVi : 0,
                                       NoiDung = khdgn.NoiDung,
                                       TrangThai = khdgn.TrangThai,
                                       MucDich = khdgn.MucDich,
                                       DuThaoBaoCao = khdgn.DuThaoBaoCao,
                                       HoanThienBaoCao = khdgn.HoanThienBaoCao,
                                       IdKeHoachTDG = khtdg.Id,
                                       IdTruong = khtdg.IdDonVi,
                                       KhaoSatChinhThuc = khdgn.KhaoSatChinhThuc,
                                       KhaoSatSoBo = khdgn.KhaoSatSoBo,
                                       LayYKienPhanHoi = khdgn.LayYKienPhanHoi,
                                       Nam = khdgn != null ? khdgn.Nam : 0,
                                       NghienCuuHSDG = khdgn.NghienCuuHSDG,
                                       ToChucThucHien = khdgn.ToChucThucHien,
                                       GhiChu = khdgn.GhiChu,
                                       CreatedAt = khdgn.CreatedAt,
                                       CreatedBy = khdgn.CreatedBy,
                                       UpdatedAt = khdgn.UpdatedAt,
                                       UpdatedBy = khdgn.UpdatedBy,
                                       FInUse = khdgn.FInUse,
                                       DonViName = dv.TenDonVi,
                                       KeHoachTDGName = khtdg.NoiDung,
                                       IdTruongDGN = truongDGN.Id,
                                       IsThanhVien = tv != null ,
                                       TruongDoan = tv != null ? tv.TruongDoan : false,
                                       ThuKy = tv != null ? tv.ThuKy : false,
                                       UyVien = tv != null ? tv.UyVien : false,
                                   }
                                   );//.ToList();
                if (filter.IdKeHoach.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.Id == filter.IdKeHoach);
                }
                if (!string.IsNullOrWhiteSpace(filter.SearchKey))
                {
                    listKeHoach = listKeHoach.Where(s => s.NoiDung.Contains(filter.SearchKey));
                }
                if (!string.IsNullOrWhiteSpace(filter.TrangThai))
                {
                    listKeHoach = listKeHoach.Where(s => s.TrangThai == filter.TrangThai);
                }
                if (filter.Nam.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.Nam == filter.Nam);
                }
                if (filter.IdTruong.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.IdTruong == filter.IdTruong);
                }
                if (filter.IsThanhVien.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.IsThanhVien == filter.IsThanhVien);
                }
                if (filter.TruongDoan.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.TruongDoan == filter.TruongDoan.Value);
                }
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
        [HttpGet]
        [Route("api/KeHoachDGN/GetAll")]
        public IHttpActionResult GetAll(int IdDonVi)
        {
            var data = db.tblKeHoachDGNs.Where(t => t.IdDonVi == IdDonVi);
            return Ok(data);
        }
        [HttpGet]
        [Route("api/KeHoachDGN/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblKeHoachDGNs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblKeHoachDGNs.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }
        //[AllowAnonymous]
        [HttpGet]
        [Route("api/KeHoachDGN/GetTCTC")]
        public IHttpActionResult GetTCTC(int IdKeHoach, string type)
        {
            int? IdKeHoachTDG = IdKeHoach;
            if (type == "KHDGN" || type == "KHDGN_MYTC")
            {
                var KH_DGN = db.tblKeHoachDGNs.Find(IdKeHoach);
                IdKeHoachTDG = KH_DGN.IdKeHoachTDG;
            }

            var KH_TDG = db.tblKeHoachTDGs.Find(IdKeHoachTDG);
            var DonVi = db.DMDonVis.FirstOrDefault(s => s.Id == KH_TDG.IdDonVi);


            if (KH_TDG.IdQuyDinhTC != null)
            {

                if (type == "KHDGN_MYTC")
                {
                    var truongdoan = (from tv in db.tblThanhVienDGNs
                                      join kh_dgn in db.tblKeHoachDGNs on tv.IdTruongDGN equals kh_dgn.IdTruongDGN
                                      where kh_dgn.Id == IdKeHoach && tv.TruongDoan==true
                                      select tv).FirstOrDefault();
                    string UserNameTruongDoan = truongdoan == null ? "" : truongdoan.Username;
                    //if(truongdoan!=null)
                    var hoidongTC = (from tchd in db.tblPhanCongTCDGNs
                                     where tchd.IdKeHoachDGN == IdKeHoach && tchd.UserName == HttpContext.Current.User.Identity.Name
                                     select new { tchd }
                                   ).ToList().Select(s => { return s.tchd.IdTieuChi; });
                    var listTCTC = from tchuan in db.DMTieuChuans
                                   join tchi in db.DMTieuChis on tchuan.Id equals tchi.IdTieuChuan
                                   where tchuan.IdQuyDinh == KH_TDG.IdQuyDinhTC && tchuan.NhomLoai.Contains(DonVi.NhomLoai) && tchuan.YCDanhGia == true
                                   && (hoidongTC.Any(x => x == tchi.Id) || (UserNameTruongDoan == HttpContext.Current.User.Identity.Name))
                                   select new { tchi, tchuan };
                    var result = listTCTC.OrderBy(s => s.tchuan.STT).ToList().GroupBy(t => t.tchuan)
                    .Select(t => new
                    {
                        tchuan = t.FirstOrDefault()?.tchuan,
                        tchi = t.Select(x => x.tchi)
                    }).ToList();
                    return Ok(result);
                }
                else
                {
                    var listTCTC = from tchuan in db.DMTieuChuans
                                   join tchi in db.DMTieuChis on tchuan.Id equals tchi.IdTieuChuan
                                   where tchuan.IdQuyDinh == KH_TDG.IdQuyDinhTC && tchuan.NhomLoai.Contains(DonVi.NhomLoai) && tchuan.YCDanhGia == true
                                   select new { tchi, tchuan };
                    var result = listTCTC.OrderBy(s => s.tchuan.STT).ToList().GroupBy(t => t.tchuan)
                    .Select(t => new
                    {
                        tchuan = t.FirstOrDefault()?.tchuan,
                        tchi = t.Select(x => x.tchi)
                    }).ToList();
                    return Ok(result);
                }

            }
            return Ok();
        }
        [HttpGet]
        [Route("api/KeHoachDGN/GetPhanCongTCTC")]
        public IHttpActionResult GetPhanCongTCTC(int IdKeHoach)
        {
            var rs = db.tblPhanCongTCDGNs.Where(s => s.IdKeHoachDGN == IdKeHoach);
            return Ok(rs);
        }
        [HttpPost]
        [Route("api/KeHoachDGN/Save")]
        public IHttpActionResult Save([FromBody] tblKeHoachDGN data)
        {

            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Id == null || data.Id == 0)
            {
                db.tblKeHoachDGNs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            if (data.ListPhanCongTCDGN != null && data.ListPhanCongTCDGN.Count() > 0)
            {
                foreach (var phancong in data.ListPhanCongTCDGN)
                {
                    phancong.IdKeHoachDGN = data.Id;
                    if (phancong.Id == null || phancong.Id == 0)
                    {
                        db.tblPhanCongTCDGNs.Add(phancong);
                        db.SaveChanges();
                    }
                    else
                    {
                        db.Entry(phancong).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                }
            }
           if (data.ListThanhVien != null && data.ListThanhVien.Count() > 0)
            {
                foreach (var tv in data.ListThanhVien)
                {
                    if ( tv.Id!= 0)
                    {
                        db.Entry(tv).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                    //else
                    //{
                    //    db.Entry(tv).State = EntityState.Modified;
                    //    db.SaveChanges();
                    //}
                }
            }
            return Ok(data);

        }

        private void Validate(tblKeHoachDGN item)
        {
            if (string.IsNullOrEmpty(item.NoiDung))
            {
                ModelState.AddModelError("NoiDung", "Nội dung bắt buộc nhập");
                ModelState.AddModelError("NoiDung", "has-error");
            }
            if (string.IsNullOrEmpty(item.MucDich))
            {
                ModelState.AddModelError("MucDich", "Mục đích bắt buộc nhập");
                ModelState.AddModelError("MucDich", "has-error");
            }
        }
    }
}
namespace WebApiCore.Models
{
    public partial class tblKeHoachDGN
    {
        public List<tblPhanCongTCDGN> ListPhanCongTCDGN { get; set; }
        public List<tblThanhVienDGN> ListThanhVien { get; set; }
    }
}
