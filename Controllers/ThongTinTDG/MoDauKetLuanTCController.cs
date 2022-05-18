using Newtonsoft.Json;
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
    public class MoDauKetLuanTCController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/MoDauKetLuanTC/LoadTCTCByUser")]
        public IHttpActionResult LoadTCTCByUser()
        {
            string userName = HttpContext.Current.User.Identity.Name;
            var user = db.UserProfiles.Where(x => x.UserName == userName && x.FInUse == true).FirstOrDefault();

            if (user != null && !string.IsNullOrEmpty(user.TieuChi))
            {
                var listTieuChiId = JsonConvert.DeserializeObject<List<int>>(user.TieuChi);
                var listTCTC = from tcId in listTieuChiId
                               join tchi in db.DMTieuChis on tcId equals tchi.Id
                               join tchuan in db.DMTieuChuans on tchi.IdTieuChuan equals tchuan.Id
                               where tchi.IdDonVi == user.IDDonVi
                               select new { tchi, tchuan };
                var result = listTCTC.GroupBy(t => t.tchuan).ToList();
                return Ok(result);
            }

            return Ok();
        }


        [HttpGet]
        [Route("api/MoDauKetLuanTC/LoadMDKLTC")]
        public IHttpActionResult LoadMDKLTC(int IdTieuChuan, int IdDonVi, int IdKeHoachTDG)
        {
            var result = db.tblMoDauKetLuanTCs.Where(x => x.IdDonVi == IdDonVi 
            && x.IdTieuChuan == IdTieuChuan && x.IdKeHoachTDG == IdKeHoachTDG);
            var md = result.Where(t => t.Loai == "MD").FirstOrDefault();
            var kl = result.Where(t => t.Loai == "KL").FirstOrDefault();

            return Ok(new
            {
                MoDau = md,
                KetLuan = kl
            });
        }

        [HttpPost]
        [Route("api/MoDauKetLuanTC/Save")]
        public IHttpActionResult Save(tblMoDauKetLuanTC data)
        {
            if (data.Id == null || data.Id == 0)
            {
                db.tblMoDauKetLuanTCs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);
        }
    }
}
