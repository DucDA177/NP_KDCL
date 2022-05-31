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
using static WebApiCore.Controllers.FilesController;

namespace WebApiCore.Controllers.ThongTinTDG
{
    [Authorize]
    public class MinhChungController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/MinhChung/LoadDSMinhChung")]
        public IHttpActionResult LoadDSMinhChung(int IdDonVi, int IdKeHoachTDG ,int idTieuChi, string heThongMa, bool ChiThuThap)
        {
            var result = db.tblMinhChungs.Where(x => x.IdDonVi == IdDonVi
            && x.IdKeHoachTDG == IdKeHoachTDG
            && (x.HeThongMa == heThongMa || string.IsNullOrEmpty(heThongMa) )
            && (x.IdTieuChi == idTieuChi || idTieuChi == 0))
                .OrderBy(t => t.Ma);

            if(ChiThuThap)
            {
                var username = HttpContext.Current.User.Identity.Name;
                var rs = from mc in result
                         join pcmc in db.tblPhanCongMinhChungs
                         on mc.Id equals pcmc.IdMinhChung
                         where pcmc.NguoiThuThap == username
                         select mc;
                return Ok(rs);
            };

            return Ok(result);
        }

        /// <summary>
        /// Render danh sách hệ thống mã
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/MinhChung/LoadHeThongMa")]
        public IHttpActionResult LoadHeThongMa()
        {
            var result = new List<string>();
            for(int i = 1; i<100; i++)
            {
                result.Add(("H" + i));
            }
            return Ok(result);
        }

        /// <summary>
        /// Load số minh chứng
        /// </summary>
        /// <param name="heThongMa"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/MinhChung/LoadSoMinhChung")]
        public IHttpActionResult LoadSoMinhChung(string heThongMa)
        {
            var count = db.tblMinhChungs.Where(x => x.HeThongMa == heThongMa).Count();
            return Ok(count + 1);
        }

        /// <summary>
        /// API lưu thông tin minh chứng
        /// </summary>
        /// <param name="data">Nội dung minh chứng cần lưu</param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/MinhChung/LuuMinhChung")]
        public IHttpActionResult Save([FromBody] tblMinhChung data)
        {
            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (data.Id == null || data.Id == 0)
            {
                db.tblMinhChungs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);

        }

        /// <summary>
        /// Validate dữ liệu trước khi lưu
        /// </summary>
        /// <param name="data"></param>
        private void Validate(tblMinhChung data)
        {
            if (data.IdTieuChi == 0)
            {
                ModelState.AddModelError("IdTieuChi", "Tiêu chí bắt buộc chọn");
                ModelState.AddModelError("IdTieuChi", "has-error");
            }
            if (string.IsNullOrEmpty(data.HeThongMa))
            {
                ModelState.AddModelError("HeThongMa", "Hệ thống mã bắt buộc chọn");
                ModelState.AddModelError("HeThongMa", "has-error");
            }
            if (string.IsNullOrEmpty(data.TenMinhChung))
            {
                ModelState.AddModelError("TenMinhChung", "Tên minh chứng bắt buộc nhập");
                ModelState.AddModelError("TenMinhChung", "has-error");
            }
        }

        [HttpGet]
        [Route("api/MinhChung/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblMinhChungs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblMinhChungs.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }

        [HttpGet]
        [Route("api/MinhChung/LoadFileMinhChung")]
        public List<FileToUpload> LoadFileMinhChung(int IdMinhChung)
        {

            List<FileToUpload> ls = new List<FileToUpload>();
            if (IdMinhChung == 0) return ls;

            var mc = db.tblMinhChungs.Find(IdMinhChung);

            if(mc == null || mc.HasFile != true || string.IsNullOrEmpty(mc.DuongDanFile))
                return ls;
           
            string folderPath = HttpContext.Current.Server.MapPath(mc.DuongDanFile);
            bool exists = Directory.Exists(folderPath);
            if (exists)
            {
                DirectoryInfo d = new DirectoryInfo(folderPath);//Assuming Test is your Folder
                FileInfo[] Files = d.GetFiles(); //Getting Text files
                if (Files.Any())
                    foreach (var file in Files)
                    {
                        //string contents = File.ReadAllText(file);
                        FileToUpload fl = new FileToUpload();
                        fl.filename = mc.DuongDanFile + "/" + file.Name;
                        fl.FName = file.Name;
                        fl.isSaved = true;
                        ls.Add(fl);
                    }
            }

            return ls;
        }

        [HttpPost]
        [Route("api/MinhChung/UploadFileMinhChung")]
        public IHttpActionResult UploadFileMinhChung(int IdMinhChung)
        {

            HttpFileCollection httpRequest = HttpContext.Current.Request.Files;
            var mc = db.tblMinhChungs.Find(IdMinhChung);

            if (httpRequest.Count == 0)
                return Ok();

            string _folderpath = "/HOSOMINHCHUNG/"
                + mc.IdDonVi + "/" + mc.IdKeHoachTDG + "/" + mc.Ma;

            string folderpath = HttpContext.Current.Server.MapPath(_folderpath);

            bool exists = Directory.Exists(folderpath);

            if (!exists)
                Directory.CreateDirectory(folderpath);

            bool hasFile = false;

            var countFileExist = LoadFileMinhChung(IdMinhChung).Count;

            for (int i = 0; i <= httpRequest.Count - 1; i++)
            {
                HttpPostedFile postedfile = httpRequest[i];
                if (postedfile.ContentLength > 0)
                {
                    var extension = Path.GetExtension(postedfile.FileName);
                    var fileName = mc.Ma + (i+ countFileExist + 1).ToString() + extension;
                    var fileSavePath = Path.Combine(folderpath, fileName);
                    if (File.Exists(fileSavePath))
                    {
                        File.Delete(fileSavePath);
                    }
                    postedfile.SaveAs(fileSavePath);

                    hasFile = true;
                }
            }
            mc.HasFile = hasFile;
            if (hasFile)
                mc.DuongDanFile = _folderpath;
            else
                mc.DuongDanFile = null;

            db.SaveChanges();
            
            return Ok();
        }

    }
}
