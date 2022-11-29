﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
    [RoutePrefix("api/KQKhaoSat")]
    public class KQKhaoSatController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        public class FilterKQKS : FilterModel
        {
            public int? IdBaoCao { get; set; }
            public int? IdKeHoach { get; set; }
            public int? IdTieuChi { get; set; }
            public int? IdTieuChuan { get; set; }
            public string TrangThai { get; set; }
            public string UserName { get; set; }
            public string TenNguoiNhap { get; set; }
        }
        public class BaoCaoKQKSModel : tblKetQuaKhaoSat_KHDGN
        {
            public string DonViName { get; set; }
            public string KeHoachTDGName { get; set; }
            public string KeHoachDGNName { get; set; }
            public string NguoiNhapName { get; set; }
            public string DonViNguoiNhapName { get; set; }
            public string DienThoai { get; set; }
            public string Email { get; set; }
            public bool IsBaoCao { get; set; }

        }
        [HttpPost]
        [Route("Filter")]
        public IHttpActionResult Filter(FilterKQKS filter)
        {
            try
            {
                var listKeHoach = (from bc in db.tblKetQuaKhaoSat_KHDGN
                                   join khdgn in db.tblKeHoachDGNs on bc.IdKeHoachDGN equals khdgn.Id
                                   join us in db.UserProfiles on bc.CreatedBy equals us.UserName
                                   join dvUs in db.DMDonVis on bc.IdDonVi equals dvUs.Id
                                   join dv in db.DMDonVis on khdgn.IdTruong equals dv.Id
                                   join khtdg in db.tblKeHoachTDGs on khdgn.IdKeHoachTDG equals khtdg.Id into tmpKHTDG
                                   from khtdg in tmpKHTDG.DefaultIfEmpty()
                                   where khdgn.FInUse == true
                                   select
                                   new BaoCaoKQKSModel
                                   {
                                       Id = bc.Id,
                                       STT = bc.STT,
                                       IdDonVi = bc.IdDonVi,
                                       KeHoachDGNName = khdgn.NoiDung,
                                       TrangThai = bc.TrangThai,
                                       GhiChu = bc.GhiChu,
                                       DienThoai = us.Mobile,
                                       Email = us.Email,
                                       IdKeHoachDGN = khdgn.Id,
                                       DiemManh = bc.DiemManh,
                                       DiemYeu = bc.DiemYeu,
                                       GioiThieuChung=bc.GioiThieuChung,
                                       KienNghi=bc.KienNghi,
                                       Tomtat=bc.Tomtat,
                                       KeHoachCaiTien = bc.KeHoachCaiTien,
                                       KQChiBao = bc.KQChiBao,
                                       KQDatA = bc.KQDatA,
                                       KQDatB = bc.KQDatB,
                                       KQDatC = bc.KQDatC,
                                       KQDatMuc = bc.KQDatMuc,
                                       NoiDungCanBoSung = bc.NoiDungCanBoSung,
                                       CreatedAt = bc.CreatedAt,
                                       CreatedBy = bc.CreatedBy,
                                       UpdatedAt = bc.UpdatedAt,
                                       UpdatedBy = bc.UpdatedBy,
                                       FInUse = bc.FInUse,
                                       DonViName = dv.TenDonVi,
                                       KeHoachTDGName = khtdg.NoiDung,
                                       NguoiNhapName = us.HoTen,
                                       DonViNguoiNhapName = dvUs.TenDonVi
                                   }
                                   );
               
               
                if (filter.IdBaoCao.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.Id == filter.IdBaoCao);
                }
                if (filter.IdKeHoach.HasValue)
                {
                    listKeHoach = listKeHoach.Where(s => s.IdKeHoachDGN == filter.IdKeHoach);
                }
                if (!string.IsNullOrWhiteSpace(filter.SearchKey))
                {
                    listKeHoach = listKeHoach.Where(s => s.KeHoachDGNName.Contains(filter.SearchKey));
                }
                if (!string.IsNullOrWhiteSpace(filter.TrangThai))
                {
                    listKeHoach = listKeHoach.Where(s => s.TrangThai == filter.TrangThai);
                }
                if (!string.IsNullOrWhiteSpace(filter.UserName))
                {
                    listKeHoach = listKeHoach.Where(s => s.CreatedBy == filter.UserName);
                }
                if (!string.IsNullOrWhiteSpace(filter.TenNguoiNhap))
                {
                    listKeHoach = listKeHoach.Where(s => s.NguoiNhapName.Contains(filter.TenNguoiNhap));
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
        [Route("GetByIdKeHoach")]
        public IHttpActionResult GetByIdKeHoach(int IdKeHoach)
        {
            try
            {
                var hd = db.tblHoiDongDGNs.FirstOrDefault(s => s.Username == HttpContext.Current.User.Identity.Name);
                bool isBaoCao = hd != null ? hd.ThuKy.HasValue ? hd.ThuKy.Value : false : false;
                var data = (from bc in db.tblKetQuaKhaoSat_KHDGN
                            join khdgn in db.tblKeHoachDGNs on bc.IdKeHoachDGN equals khdgn.Id
                            join us in db.UserProfiles on bc.CreatedBy equals us.UserName
                            join dvUs in db.DMDonVis on bc.IdDonVi equals dvUs.Id
                            join dv in db.DMDonVis on khdgn.IdTruong equals dv.Id
                            join khtdg in db.tblKeHoachTDGs on khdgn.IdKeHoachTDG equals khtdg.Id into tmpKHTDG
                            from khtdg in tmpKHTDG.DefaultIfEmpty()
                            where khdgn.FInUse == true  && khdgn.Id == IdKeHoach 
                            select
                            new BaoCaoKQKSModel
                            {
                                Id = bc.Id,
                                STT = bc.STT,
                                IdDonVi = bc.IdDonVi,
                                KeHoachDGNName = khdgn.NoiDung,
                                TrangThai = bc.TrangThai,
                                GhiChu = bc.GhiChu,
                                DienThoai = us.Mobile,
                                Email = us.Email,
                                IdKeHoachDGN = khdgn.Id,
                                DiemManh = bc.DiemManh,
                                DiemYeu = bc.DiemYeu,
                                GioiThieuChung = bc.GioiThieuChung,
                                KienNghi = bc.KienNghi,
                                Tomtat = bc.Tomtat,
                                KeHoachCaiTien = bc.KeHoachCaiTien,
                                KQChiBao = bc.KQChiBao,
                                KQDatA = bc.KQDatA,
                                KQDatB = bc.KQDatB,
                                KQDatC = bc.KQDatC,
                                KQDatMuc = bc.KQDatMuc,
                                NoiDungCanBoSung = bc.NoiDungCanBoSung,
                                CreatedAt = bc.CreatedAt,
                                CreatedBy = bc.CreatedBy,
                                UpdatedAt = bc.UpdatedAt,
                                UpdatedBy = bc.UpdatedBy,
                                FInUse = bc.FInUse,
                                DonViName = dv.TenDonVi,
                                KeHoachTDGName = khtdg.NoiDung,
                                NguoiNhapName = us.HoTen,
                                DonViNguoiNhapName = dvUs.TenDonVi,
                                IsBaoCao = isBaoCao
                            }
                                   ).FirstOrDefault();
                if (data == null)
                {
                    var UserNhap = (from u in db.UserProfiles
                                    join dv in db.DMDonVis on u.IDDonVi equals dv.Id
                                    where u.UserName == HttpContext.Current.User.Identity.Name
                                    select new { u, dv }
                                  ).FirstOrDefault();
                    var KeHoachDGN = (from kh in db.tblKeHoachDGNs
                                      join dv in db.DMDonVis on kh.IdTruong equals dv.Id
                                      where kh.Id == IdKeHoach
                                      select new { kh, dv }
                                  ).FirstOrDefault();
                    if (UserNhap != null)
                    {
                        var BaoCao = new BaoCaoKQKSModel()
                        {
                            IdDonVi = (int)UserNhap.u.IDDonVi,
                            NguoiNhapName = UserNhap.u.HoTen,
                            DonViNguoiNhapName = UserNhap.dv.TenDonVi,
                            CreatedBy = HttpContext.Current.User.Identity.Name,
                            IdKeHoachDGN = IdKeHoach,
                            KeHoachDGNName = KeHoachDGN.kh.NoiDung,
                            DonViName = KeHoachDGN.dv.TenDonVi,
                            Email = UserNhap.u.Email,
                            DienThoai = UserNhap.u.Mobile,
                            TrangThai = Commons.Constants.DANG_SOAN,
                            IsBaoCao = isBaoCao
                        };
                        return Ok(BaoCao);
                    }
                }
                return Ok(data);
            }
            catch (Exception ex)
            {
                Commons.Common.WriteLogToTextFile(ex.ToString());
                return null;
            }

        }
        [HttpGet]
        [Route("GetAll")]
        public IHttpActionResult GetAll(int IdDonVi)
        {
            var data = db.tblKetQuaKhaoSat_KHDGN.Where(t => t.IdDonVi == IdDonVi);
            return Ok(data);
        }
        [HttpGet]
        [Route("Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblKetQuaKhaoSat_KHDGN.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblKetQuaKhaoSat_KHDGN.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }
        [HttpPost]
        [Route("Save")]
        public IHttpActionResult Save([FromBody] tblKetQuaKhaoSat_KHDGN data)
        {

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (data.Id == null || data.Id == 0)
                {
                    db.tblKetQuaKhaoSat_KHDGN.Add(data);
                    db.SaveChanges();
                }
                else
                {
                    db.Entry(data).State = EntityState.Modified;
                    db.SaveChanges();

                }
                return Ok(data);
            }
            catch (Exception ex)
            {
                Commons.Common.WriteLogToTextFile(ex.ToString());
                return null;
            }


        }
    }
}