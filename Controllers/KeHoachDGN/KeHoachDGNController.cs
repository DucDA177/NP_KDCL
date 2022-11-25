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
        }
        public class KeHoachDGNModel : tblKeHoachDGN
        {
            public string DonViName { get; set; }
            public string KeHoachTDGName { get; set; }
        }
        [HttpPost]
        [Route("api/KeHoachDGN/FilterKHDGN")]
        public IHttpActionResult FilterKeHoachDGN(FilterKHDGN filter)
        {
            try
            {
                var listKeHoach = (from khdgn in db.tblKeHoachDGNs
                                   join dv in db.DMDonVis on khdgn.IdTruong equals dv.Id
                                   join khtdg in db.tblKeHoachTDGs on khdgn.IdKeHoachTDG equals khtdg.Id into tmpKHTDG
                                   from khtdg in tmpKHTDG.DefaultIfEmpty()
                                   where khdgn.FInUse == true
                                   select //kh
                                   new KeHoachDGNModel
                                   {
                                       Id = khdgn.Id,
                                       STT = khdgn.STT,
                                       IdDonVi = khdgn.IdDonVi,
                                       NoiDung = khdgn.NoiDung,
                                       TrangThai = khdgn.TrangThai,
                                       MucDich = khdgn.MucDich,
                                       DuThaoBaoCao=khdgn.DuThaoBaoCao,
                                       HoanThienBaoCao= khdgn.HoanThienBaoCao,
                                       IdKeHoachTDG= khdgn.IdKeHoachTDG,
                                       IdTruong=khdgn.IdTruong,
                                       KhaoSatChinhThuc=khdgn.KhaoSatChinhThuc,
                                       KhaoSatSoBo=khdgn.KhaoSatSoBo,
                                       LayYKienPhanHoi=khdgn.LayYKienPhanHoi,
                                       Nam=khdgn.Nam,
                                       NghienCuuHSDG=khdgn.NghienCuuHSDG,
                                       ToChucThucHien=khdgn.ToChucThucHien,
                                       GhiChu = khdgn.GhiChu,
                                       CreatedAt = khdgn.CreatedAt,
                                       CreatedBy = khdgn.CreatedBy,
                                       UpdatedAt = khdgn.UpdatedAt,
                                       UpdatedBy = khdgn.UpdatedBy,
                                       FInUse = khdgn.FInUse,
                                       DonViName = dv.TenDonVi,
                                       KeHoachTDGName = khtdg.NoiDung
                                   }
                                   );
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
                    listKeHoach = listKeHoach.Where(s => s.TrangThai == filter.TrangThai );
                }
                if (filter.Nam.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s =>s.Nam==filter.Nam);
                }
                if (filter.IdTruong.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.IdTruong == filter.IdTruong);
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
        public IHttpActionResult GetTCTC(int IdKeHoach,string type)
        {
            int? IdKeHoachTDG = IdKeHoach;
            if (type == "KHDGN")
            {
                var KH_DGN = db.tblKeHoachDGNs.Find(IdKeHoach);
                IdKeHoachTDG = KH_DGN.IdKeHoachTDG;
            }
           
            var KH_TDG = db.tblKeHoachTDGs.Find(IdKeHoachTDG);
            var DonVi = db.DMDonVis.FirstOrDefault(s => s.Id == KH_TDG.IdDonVi);
            if (KH_TDG.IdQuyDinhTC != null)
            {
                var listTCTC = from tchuan in db.DMTieuChuans
                               join tchi in db.DMTieuChis on tchuan.Id equals tchi.IdTieuChuan
                               where tchuan.IdQuyDinh == KH_TDG.IdQuyDinhTC && tchuan.NhomLoai.Contains(DonVi.NhomLoai) && tchuan.YCDanhGia==true
                               select new { tchi, tchuan };
                var result = listTCTC.OrderBy(s => s.tchuan.STT).ToList().GroupBy(t => t.tchuan)
                    .Select(t => new
                    {
                        tchuan = t.FirstOrDefault()?.tchuan,
                        tchi = t.Select(x => x.tchi)
                    }).ToList();
                return Ok(result);
            }
            return Ok();
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
