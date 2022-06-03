using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.ThongTinTDG
{
    [Authorize]
    public class PhanCongMinhChungController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/PhanCongMinhChung/GetPCMC")]
        public IHttpActionResult GetPCMC(int IdDonVi, int IdKeHoachTDG, int IdTieuChi, bool ChiThuThap)
        {
            var data = from mc in db.tblMinhChungs
                       .Where(x => x.IdTieuChi == IdTieuChi)
                       join pcmc in db.tblPhanCongMinhChungs
                       .Where(x => x.IdDonVi == IdDonVi 
                       && x.IdKeHoachTDG == IdKeHoachTDG)
                       on mc.Id equals pcmc.IdMinhChung
                       into _pcmc
                       from pcmc in _pcmc.DefaultIfEmpty()
                       select new { pcmc, mc };


            if (ChiThuThap)
            {
                var username = HttpContext.Current.User.Identity.Name;
                var rs = from mc in data
                         join pcmc in db.tblPhanCongMinhChungs
                         on mc.mc.Id equals pcmc.IdMinhChung
                         where pcmc.NguoiThuThap.Contains(username)
                         select mc;
                return Ok(rs);
            };

            return Ok(data);
        }

        [HttpPost]
        [Route("api/PhanCongMinhChung/Save")]
        public IHttpActionResult Save([FromBody] List<tblPhanCongMinhChung> listData)
        {
            foreach(var data in listData)
            {
                Validate(data);
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (data.Id == 0)
                {
                    db.tblPhanCongMinhChungs.Add(data);
                }
                else
                {
                    db.Entry(data).State = EntityState.Modified;
                }
            }
            db.SaveChanges();
            return Ok(listData);

        }

        [HttpGet]
        [Route("api/PhanCongMinhChung/Del")]
        public IHttpActionResult Del(int Id)
        {
            var dt = db.tblPhanCongMinhChungs.Where(t => t.FInUse == true && t.Id == Id).FirstOrDefault();
            db.tblPhanCongMinhChungs.Remove(dt);
            db.SaveChanges();
            return Ok(dt);

        }


        [HttpGet]
        [Route("api/PhanCongMinhChung/LoadUserByTieuChi")]
        public IHttpActionResult LoadUserByTieuChi(int IdDonVi, int IdKeHoachTDG ,int IdTieuChi)
        {
            string _IdTieuChi = IdTieuChi.ToString();
            var dt = from hd in db.tblHoiDongs
                     join user in db.UserProfiles
                     on hd.Username equals user.UserName
                     join cv in db.tblDanhmucs
                     on hd.IdChucVu equals cv.Id
                     join nv in db.tblDanhmucs
                     on hd.IdNhiemVu equals nv.Id
                     where hd.FInUse == true && user.FInUse == true
                     && hd.IdDonVi == IdDonVi && hd.IdKeHoachTDG == IdKeHoachTDG
                     && user.TieuChi.Contains(_IdTieuChi)
                     select new
                     {
                         Username = user.UserName,
                         HoTen = user.HoTen,
                         ChucVu = cv.Ten,
                         NhiemVu = nv.Ten
                     };
           
            return Ok(dt);

        }
    }
}
