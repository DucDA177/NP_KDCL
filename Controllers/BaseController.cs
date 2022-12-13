using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    public class BaseController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        public class itemTreeText
        {

            public int FLevel { get; set; }
            public int Id { get; set; }
            public string Ma { get; set; }
            public string Ten { get; set; }
            public string Text { get; set; }
            public string LoaiDonVi { get; set; }
            public int index { get; set; }
        }
        [HttpGet]
        [Route("api/Base/GetRoleUserDGN")]
        public IHttpActionResult GetRoleUserDGN()
        {
            var userRole = (from user in db.tblThanhVienDGNs
                            join truongDGN in db.tblTruongDGNs on user.IdTruongDGN equals truongDGN.Id
                            where user.Username == HttpContext.Current.User.Identity.Name && truongDGN.FInUse == true
                            select new { user, truongDGN });

            return Ok();
        }
        [HttpGet]
        [Route("api/Base/GetThanhVienDGN")]
        public IHttpActionResult GetThanhVienDGN(string PhanLoai, int IdDonVi, int IdKeHoachTDG, int IdKeHoachDGN)
        {
           
            try{
                string RoleKeHoach = "";
                if (IdKeHoachDGN != 0)
                {

                    if (PhanLoai == "BAOCAOSOBO")
                    {
                       // var khDGN = db.tblKeHoachDGNs.Find(IdKeHoachDGN);
                        RoleKeHoach = "BAOCAOSOBO";

                    }
                    if (PhanLoai == "BAOCAOTIEUCHI")
                    {
                        var phancong = db.tblPhanCongTCDGNs.Where(s => s.IdKeHoachDGN == IdKeHoachDGN).ToList();
                        RoleKeHoach = String.Join(@"""", phancong.Select(s => { return s.UserName; }).ToList());
                    }
                }
                //var listUserByKHTDG = (from doan in db.tblDoanDGNs
                //                       join truongDGN in db.tblTruongDGNs on doan.Id equals truongDGN.IdDoanDGN
                //                       where truongDGN.IdKeHoachTDG == IdKeHoachTDG
                //                       select doan
                //                       ).FirstOrDefault();
                //string StringUserByKHTDG = listUserByKHTDG != null && !string.IsNullOrWhiteSpace(listUserByKHTDG.DSThanhVien)? listUserByKHTDG.DSThanhVien:"";
                
                var userRole = (from us in db.UserProfiles
                                join tv in db.tblThanhVienDGNs on us.UserName equals tv.Username
                                join  truongDGN in db.tblTruongDGNs on tv.IdTruongDGN equals truongDGN.Id
                                join dv in db.DMDonVis on us.IDDonVi equals dv.Id
                                where truongDGN.IdKeHoachTDG == IdKeHoachTDG
                               // (string.IsNullOrEmpty(StringUserByKHTDG) || StringUserByKHTDG.Contains(@"""" + us.UserName + @""""))
                                && (string.IsNullOrEmpty(RoleKeHoach)||tv.TruongDoan==true||(RoleKeHoach == "BAOCAOSOBO" && tv.UyVien==true) || RoleKeHoach.Contains(@"""" + us.UserName + @""""))
                                select new { us,tv, dv }).OrderByDescending(s=>s.tv.TruongDoan).ThenByDescending(s=>s.tv.ThuKy);
                return Ok(userRole);
            }
            catch(Exception ex)
            {
                Commons.Common.WriteLogToTextFile(ex.ToString());
                return null;
               
            }
                
          //  }
        ///
            //if (PhanLoai.Contains("ALL"))
            //{
            //    string RoleKeHoach = "";
            //    if (IdKeHoachDGN != 0)
            //    {
            //        if (PhanLoai == "ALLBAOCAOSOBO")
            //        {
            //            var khDGN = db.tblKeHoachDGNs.Find(IdKeHoachDGN);
            //            RoleKeHoach = khDGN.NghienCuuHSDG;

            //        }
            //        if (PhanLoai == "ALLBAOCAOTIEUCHI")
            //        {
            //            var phancong = db.tblPhanCongTCDGNs.Where(s => s.IdKeHoachDGN == IdKeHoachDGN).ToList();
            //            RoleKeHoach = String.Join(@"""", phancong.Select(s => { return s.UserName; }).ToList());
            //        }
            //    }
            //    var userRole = (from us in db.UserProfiles
            //                    join tv in db.tblThanhVienDGNs on us.UserName equals tv.Username into userTmp
            //                    from tv in userTmp.DefaultIfEmpty()
            //                    join truongDGN in db.tblTruongDGNs on tv.IdTruongDGN equals truongDGN.Id into truongDGNTmp
            //                    from truongDGN in truongDGNTmp.DefaultIfEmpty()
            //                    where
            //                      (string.IsNullOrEmpty(RoleKeHoach) || RoleKeHoach.Contains(@"""" + us.UserName + @""""))

            //                    // where truongDGN.IdKeHoachTDG == IdKeHoachTDG
            //                    select new { tv, us, truongDGN });
            //    return Ok(userRole);
            //}
        //    return Ok();

        }
        [HttpGet]
        [Route("api/Base/GetDMDonVi")]
        public IHttpActionResult GetDMDonVi(string PhanLoai, string SearchKey)
        {
            var rs = (from dv in db.DMDonVis where dv.FInUse == true select dv);
            if (!string.IsNullOrWhiteSpace(PhanLoai))
            {
                rs = rs.Where(dv => dv.LoaiDonVi == PhanLoai);
            }
            if (!string.IsNullOrWhiteSpace(SearchKey))
            {
                rs = rs.Where(dv => dv.TenDonVi.Contains(SearchKey));
            }
            if (!string.IsNullOrWhiteSpace(PhanLoai) || !string.IsNullOrWhiteSpace(SearchKey))
            {
                return Ok(rs);
            }
            var Truong_User = (from user in db.tblThanhVienDGNs
                               join truongDGN in db.tblTruongDGNs on user.IdTruongDGN equals truongDGN.Id
                               where user.Username == HttpContext.Current.User.Identity.Name && user.FInUse==true && truongDGN.FInUse == true
                               select truongDGN).ToList().Select(s => { return s.IdTruong; });
            //var Truong_User = (from doan in db.tblDoanDGNs
            //                   join truongDGN in db.tblTruongDGNs on doan.Id equals truongDGN.IdDoanDGN
            //                   where doan.DSThanhVien.Contains(@"""" + HttpContext.Current.User.Identity.Name + @"""") && truongDGN.FInUse == true
            //                   select truongDGN).ToList().Select(s => { return s.IdTruong; });//.Select(s => { return s.IdTruong; });
            var DVSo = db.DMDonVis.FirstOrDefault(s => s.LoaiDonVi == "SO");
            ArrayList DonViList = new ArrayList();
            Stack sTree = new Stack();
            itemTreeText item = new itemTreeText()
            {
                Id = DVSo.Id,
                Ma = DVSo.MaDonVi,
                Ten = DVSo.TenDonVi,
                FLevel = 0,
                index = 1,
                Text = "",
                LoaiDonVi = DVSo.LoaiDonVi,

            };
            sTree.Push(item);
            while (sTree.Count > 0)
            {
                itemTreeText tmp = (itemTreeText)sTree.Pop();
                string Text = tmp.Text;
                //if (tmp.LoaiDonVi != "TRUONG" || HttpContext.Current.User.Identity.Name == "admin.daduc" || Truong_User.Any(s =>s.HasValue && s.Value== tmp.Id))
                //{}
                var o = new
                {
                    Id = tmp.Id,
                    code = tmp.Id,
                    TenDonViGoc = tmp.Ten,
                    TenDonVi = Text + " " + tmp.Ten,
                    MaDonVi =  tmp.Ma,
                    LoaiDonVi = tmp.LoaiDonVi,
                };
                DonViList.Add(o);
                var orgs = db.DMDonVis.Where(x => x.IDDVCha == tmp.Id && (x.LoaiDonVi != "TRUONG" || HttpContext.Current.User.Identity.Name == "admin.daduc" || Truong_User.Any(s => s == x.Id))).ToList();
                for (int i = orgs.Count() - 1; i >= 0; i--)
                {
                    Text = tmp.Text + (i + 1).ToString() + ".";
                    itemTreeText itemO = new itemTreeText()
                    {
                        Id = orgs[i].Id,
                        Ten = orgs[i].TenDonVi,
                        FLevel = tmp.FLevel + 1,
                        index = i + 1,
                        Text = Text,
                        LoaiDonVi = orgs[i].LoaiDonVi,
                        Ma = orgs[i].MaDonVi,
                    };
                    sTree.Push(itemO);
                }

            }

            return Ok(DonViList);
        }
    }
}
