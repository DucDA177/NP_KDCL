using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
   
    public class ThuVienTaiLieuController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        private readonly string BasePath = HttpContext.Current.Server.MapPath("~/ThuVienTaiLieu/");
        private readonly int IdCurrentDonVi;
        private readonly bool CheckAdmin;

        public ThuVienTaiLieuController()
        {
            string Username = HttpContext.Current.Request.Cookies.Get("username").Value;
            IdCurrentDonVi = Convert.ToInt32(HttpContext.Current.Request.Cookies.Get("DonVi").Value);
            CheckAdmin = db.Group_User.Where(x => x.UserName == Username).Select(x => x.CodeGroup).Contains("ADMIN");
        }

        [HttpGet]
        [Route("api/ThuVienTaiLieu/Get")]
        public IHttpActionResult Get(int pageNumber, int pageSize, string searchKey)
        {
            searchKey = searchKey?.ToLower();
            var data = db.tblThuVienTaiLieux.Where(x => x.SearchKey.Contains(searchKey) 
            || string.IsNullOrEmpty(searchKey));

            if (!CheckAdmin)
            {
                string dvString = "\"" + IdCurrentDonVi.ToString() + "\"";
                data = data.Where(x => x.DonVi.Contains(dvString) 
                || string.IsNullOrEmpty(x.DonVi) 
                || x.DonVi == "[]");
            }
            return Ok(Commons.Common.GetPagingList(data.OrderBy(x => x.STT), pageNumber, pageSize));

        }

        [HttpPost]
        [Route("api/ThuVienTaiLieu/Save")]
        public IHttpActionResult Save()
        {
            if(HttpContext.Current.Request.Form.Count == 0)
                return BadRequest();

            var ndkt = JsonConvert.DeserializeObject<tblThuVienTaiLieu>(HttpContext.Current.Request.Form.Get("tblThuVienTaiLieu"));
            if (ndkt == null)
                return BadRequest();

            string Link = SaveFile(HttpContext.Current.Request.Files);

            if(Link != null)
                ndkt.Link = Link;

            Validate(ndkt);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ndkt.SearchKey = ndkt.TieuDe.ToLower() + " " + Commons.Common.ReplaceUnicode(ndkt.TieuDe.ToLower());

            if (ndkt.STT == 0)
                ndkt.STT = db.tblThuVienTaiLieux.Count() + 1;

            if (ndkt.Id == 0)
            {
                db.tblThuVienTaiLieux.Add(ndkt);
                db.SaveChanges();
            }
            else
            {
                db.Entry(ndkt).State = EntityState.Modified;
                db.SaveChanges();
            }
            return Ok(ndkt);

        }
        private void Validate(tblThuVienTaiLieu item)
        {
            if (string.IsNullOrEmpty(item.TieuDe))
            {
                ModelState.AddModelError("TieuDe", "Tiêu đề bắt buộc nhập");
                ModelState.AddModelError("TieuDe", "has-error");
            }
            if (string.IsNullOrEmpty(item.Link) && item.Id == 0)
            {
                ModelState.AddModelError("Link", "Tài liệu đính kèm bắt buộc nhập");
                ModelState.AddModelError("Link", "has-error");
            }
        }
        private string SaveFile(HttpFileCollection requestedFiles)
        {
            string link = "/ThuVienTaiLieu/";
            bool exists = Directory.Exists(BasePath);

            if (!exists)
                Directory.CreateDirectory(BasePath);

            if (requestedFiles.Count <= 0)
                return null;

            HttpPostedFile postedfile = requestedFiles[0];
            if (postedfile.ContentLength > 0)
            {
                var fileSavePath = Path.Combine(BasePath, postedfile.FileName);
                if (File.Exists(fileSavePath))
                {
                    File.Delete(fileSavePath);
                }
                postedfile.SaveAs(fileSavePath);
                link += postedfile.FileName;
            }
            else
                link = null;

            return link;
        }

        [HttpGet]
        [Route("api/ThuVienTaiLieu/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblThuVienTaiLieux.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblThuVienTaiLieux.Remove(dt);

            FilesController filesController = new FilesController();
            filesController.DeleteFile(dt.Link);

            db.SaveChanges();
            return Ok(dt);

        }
    }
}
