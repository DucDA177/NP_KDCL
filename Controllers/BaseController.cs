using HtmlAgilityPack;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
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

        [HttpGet]
        [Route("api/Base/CopyData")]
        public IHttpActionResult CopyData(int from, int to)
        {
            var fromKHTDG = db.tblKeHoachTDGs.Find(from);
            var toKHTDG = db.tblKeHoachTDGs.Find(to);
            var fromDV = db.DMDonVis.Find(fromKHTDG.IdDonVi);
            var toDV = db.DMDonVis.Find(toKHTDG.IdDonVi);

            //Copy minh chứng
            var lsMC = db.tblMinhChungs.Where(x => x.IdKeHoachTDG == fromKHTDG.Id && x.IdDonVi == fromKHTDG.IdDonVi).AsNoTracking().ToList();
            foreach(var item in lsMC)
            {
                item.Id = 0;
                item.IdDonVi = toKHTDG.IdDonVi;
                item.IdKeHoachTDG = toKHTDG.Id;
                item.NoiBanHanh = toDV.TenDonVi;
                item.DuongDanFile = null;
                
                db.tblMinhChungs.Add(item);
            }
            var savedMC = db.SaveChanges();

            //Copy DM viết tắt, Đặt vấn đề, kết luận
            var fromDLNhaTruong = db.tblDuLieuNhaTruongs
                .Where(x => x.IdKeHoachTDG == fromKHTDG.Id && x.IdDonVi == fromKHTDG.IdDonVi && (x.Loai == "DMVietTat" || x.Loai == "DatVanDe" || x.Loai == "KetLuan"))
                .AsNoTracking().ToList();
            foreach (var item in fromDLNhaTruong)
            {
                item.Id = 0;
                item.IdDonVi = toKHTDG.IdDonVi;
                item.IdKeHoachTDG = toKHTDG.Id;

                db.tblDuLieuNhaTruongs.Add(item);
            }

            //Copy Mở đầu kết luận TC
            var fromMDKLTC = db.tblMoDauKetLuanTCs
                .Where(x => x.IdKeHoachTDG == fromKHTDG.Id && x.IdDonVi == fromKHTDG.IdDonVi )
                .AsNoTracking().ToList();
            foreach (var item in fromMDKLTC)
            {
                item.Id = 0;
                item.IdDonVi = toKHTDG.IdDonVi;
                item.IdKeHoachTDG = toKHTDG.Id;

                db.tblMoDauKetLuanTCs.Add(item);
            }

            //Copy đánh giá tiêu chí
            var fromDGTC = db.tblDanhGiaTieuChis
               .Where(x => x.IdKeHoachTDG == fromKHTDG.Id && x.IdDonVi == fromKHTDG.IdDonVi)
               .AsNoTracking().ToList();
            foreach (var item in fromDGTC)
            {
                item.Id = 0;
                item.IdDonVi = toKHTDG.IdDonVi;
                item.IdKeHoachTDG = toKHTDG.Id;
                item.YKienLanhDao = null;
                item.YKienCapTrenDG = null;
                item.CapTrenDuyet = null;
                item.YKienCapTrenKHCT = null;
                item.MoTaA = XuLyLinkMinhChung(item.MoTaA, toKHTDG.IdDonVi, toKHTDG.Id);
                item.MoTaB = XuLyLinkMinhChung(item.MoTaB, toKHTDG.IdDonVi, toKHTDG.Id);
                item.MoTaC = XuLyLinkMinhChung(item.MoTaC, toKHTDG.IdDonVi, toKHTDG.Id);
                item.KQChiBao = XuLyLinkMinhChung(item.KQChiBao, toKHTDG.IdDonVi, toKHTDG.Id);
                item.KeHoachCaiTien = XuLyLinkMinhChung(item.KeHoachCaiTien, toKHTDG.IdDonVi, toKHTDG.Id);

                db.tblDanhGiaTieuChis.Add(item);
            }

            return Ok(savedMC + db.SaveChanges());
        }

        [HttpGet]
        [Route("api/Base/CopyDataMinhChung")]
        public IHttpActionResult CopyDataMinhChung(int from, int to)
        {
            var fromKHTDG = db.tblKeHoachTDGs.Find(from);
            var toKHTDG = db.tblKeHoachTDGs.Find(to);
            var fromDV = db.DMDonVis.Find(fromKHTDG.IdDonVi);
            var toDV = db.DMDonVis.Find(toKHTDG.IdDonVi);

            //Copy dữ liệu minh chứng
            var lsMC = db.tblMinhChungs.Where(x => x.IdKeHoachTDG == fromKHTDG.Id 
            && x.IdDonVi == fromKHTDG.IdDonVi).AsNoTracking().ToList();
            foreach (var item in lsMC)
            {
                if(string.IsNullOrEmpty(item.DuongDanFile))
                    continue;

                // Your original folder path
                var folderPath = item.DuongDanFile;

                // Use regular expressions to replace values at the same positions
                var pattern = @"\/(\d+)\/(\d+)\/";
                var newFolderPath = Regex.Replace(folderPath, pattern, "/" + toKHTDG.IdDonVi + "/" + toKHTDG.Id + "/");

                string serverFolderPath = HttpContext.Current.Server.MapPath("~/" + folderPath);
                string serverNewFolderPath = HttpContext.Current.Server.MapPath("~/" + newFolderPath);

                // Create the new folder if it doesn't exist
                if (!Directory.Exists(serverFolderPath))
                {
                    Directory.CreateDirectory(serverFolderPath);
                }

                // Copy all the data from folderPath to newFolderPath
                CopyDirectory(serverFolderPath, serverNewFolderPath);

                var newMc = db.tblMinhChungs.Where(x => x.IdDonVi == toKHTDG.IdDonVi
                    && x.IdKeHoachTDG == toKHTDG.Id && x.Ma == item.Ma).FirstOrDefault();
                if(newMc != null)
                {
                    newMc.DuongDanFile = newFolderPath;
                }
            }


            return Ok(db.SaveChanges());
        }

        [HttpGet]
        [Route("api/Base/XuLySaiLinkMinhChung")]
        public IHttpActionResult XuLySaiLinkMinhChung(int to)
        {
            var toKHTDG = db.tblKeHoachTDGs.Find(to);
            var toDV = db.DMDonVis.Find(toKHTDG.IdDonVi);

            //Sửa đánh giá tiêu chí
            var fromDGTC = db.tblDanhGiaTieuChis
               .Where(x => x.IdKeHoachTDG == toKHTDG.Id && x.IdDonVi == toKHTDG.IdDonVi)
               .ToList();
            foreach (var item in fromDGTC)
            {
                item.MoTaA = XuLyLinkMinhChung(item.MoTaA, toKHTDG.IdDonVi, toKHTDG.Id);
                item.MoTaB = XuLyLinkMinhChung(item.MoTaB, toKHTDG.IdDonVi, toKHTDG.Id);
                item.MoTaC = XuLyLinkMinhChung(item.MoTaC, toKHTDG.IdDonVi, toKHTDG.Id);
                item.KQChiBao = XuLyLinkMinhChung(item.KQChiBao, toKHTDG.IdDonVi, toKHTDG.Id);
                item.KeHoachCaiTien = XuLyLinkMinhChung(item.KeHoachCaiTien, toKHTDG.IdDonVi, toKHTDG.Id);
            }

            return Ok(db.SaveChanges());
        }

        // Recursive method to copy a directory and its contents
        private void CopyDirectory(string sourceDir, string targetDir)
        {
            Directory.CreateDirectory(targetDir);

            foreach (var file in Directory.GetFiles(sourceDir))
            {
                var destFile = Path.Combine(targetDir, Path.GetFileName(file));
                File.Copy(file, destFile);
            }

            foreach (var subDir in Directory.GetDirectories(sourceDir))
            {
                var destSubDir = Path.Combine(targetDir, Path.GetFileName(subDir));
                CopyDirectory(subDir, destSubDir);
            }
        }

        private string XuLyLinkMinhChung(string html, int IdDonVi, int IdKHTDG)
        {
            if(string.IsNullOrEmpty(html))
                return null;

            // Load the HTML string into an HtmlDocument
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(html);

            // Select all <a> elements using XPath
            HtmlNodeCollection linkNodes = doc.DocumentNode.SelectNodes("//a[@class='link-minhchung']");

            // Loop through the <a> elements and modify attributes
            if (linkNodes != null)
            {
                foreach (HtmlNode linkNode in linkNodes)
                {
                    // Get the inner text of the <a> element
                    string MaMinhChung = linkNode.InnerText.Replace("[","").Replace("]", "");

                    var MinhChung = db.tblMinhChungs.Where(x => x.IdDonVi == IdDonVi 
                    && x.IdKeHoachTDG == IdKHTDG && x.Ma == MaMinhChung).FirstOrDefault();
                    if (MinhChung != null)
                    {
                        string IdMinhChung = MinhChung.Id.ToString();
                        // Modify the 'id' attribute
                        linkNode.Attributes["id"].Value = IdMinhChung;

                        // Modify the 'onclick' attribute
                        linkNode.Attributes["onclick"].Value = "angular.element(document.body).scope().OpenViewMinhChung(" + IdMinhChung + ")";

                    }

                }
            }

            // Get the modified HTML
            string modifiedHTML = doc.DocumentNode.OuterHtml;

            return modifiedHTML;
        }
    }
}
