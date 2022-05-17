using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers.DuLieuNhaTruong
{
    public class DuLieuNhaTruongController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/DuLieuNhaTruong/GetData")]
        public IHttpActionResult GetData(int IdDonVi, int IdKeHoachTDG, bool? TaiTDDG, string Loai)
        {
            var data = db.tblDuLieuNhaTruongs.Where(t => t.IdDonVi == IdDonVi && t.IdKeHoachTDG == IdKeHoachTDG
            && t.TaiTDDG == TaiTDDG && t.Loai == Loai).FirstOrDefault();

            if (data == null && TaiTDDG != true)
            {
                data = GetDataTuNamHocGanNhat(IdDonVi, IdKeHoachTDG, TaiTDDG, Loai);
            }

            return Ok(data);
        }
        private tblDuLieuNhaTruong GetDataTuNamHocGanNhat(int IdDonVi, int IdKeHoachTDG, bool? TaiTDDG, string Loai)
        {
            var currentKH = db.tblKeHoachTDGs.Find(IdKeHoachTDG);
            var kHGanNhat = db.tblKeHoachTDGs.Where(t => t.IdDonVi == IdDonVi && t.Id != IdKeHoachTDG)
                .OrderByDescending(t => t.NamHocKT).FirstOrDefault();

            var data = db.tblDuLieuNhaTruongs.Where(t => t.IdDonVi == IdDonVi && t.IdKeHoachTDG == kHGanNhat.Id
            && t.TaiTDDG == TaiTDDG && t.Loai == Loai).FirstOrDefault();

            if (data != null)
            {
                dynamic dulieu = JsonConvert.DeserializeObject(data.DuLieu);
                dynamic caccot = JsonConvert.DeserializeObject(data.CacCot);

                for (int i = 0; i < dulieu.Count; i++)
                {
                    dulieu[i].RemoveAt(2);
                    dulieu[i].Add("0");
                }

                caccot.RemoveAt(2);
                caccot.Add(JToken.FromObject(new
                {
                    title = "Năm học " + currentKH.NamHocBD + "-" + currentKH.NamHocKT,
                    width = "200px",
                }));

                data.DuLieu = JsonConvert.SerializeObject(dulieu);
                data.CacCot = JsonConvert.SerializeObject(caccot);
            }

            return data;
        }

        [HttpPost]
        [Route("api/DuLieuNhaTruong/SaveData")]
        public IHttpActionResult SaveData(tblDuLieuNhaTruong data)
        {
            Validate(data);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            DeleteExistData(data);
            if (data.Id == null || data.Id == 0)
            {
                db.tblDuLieuNhaTruongs.Add(data);
                db.SaveChanges();
            }
            else
            {
                db.Entry(data).State = EntityState.Modified;
                db.SaveChanges();

            }
            return Ok(data);

        }

        private void DeleteExistData(tblDuLieuNhaTruong data)
        {
            var dataToRemove = db.tblDuLieuNhaTruongs.Where(t => t.IdDonVi == data.IdDonVi && t.IdKeHoachTDG == data.IdKeHoachTDG
            && t.TaiTDDG == data.TaiTDDG && t.Loai == data.Loai);
            if (dataToRemove.Any())
            {
                db.tblDuLieuNhaTruongs.RemoveRange(dataToRemove);
                db.SaveChanges();
            }
        }
    }
}
