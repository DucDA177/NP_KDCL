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
        public IHttpActionResult GetData(int IdDonVi, int IdKeHoachTDG, bool? TaiTDDG, string Loai, string NamHoc)
        {
            var data = db.tblDuLieuNhaTruongs.Where(t => t.IdDonVi == IdDonVi && t.IdKeHoachTDG == IdKeHoachTDG
            && t.TaiTDDG == TaiTDDG && t.Loai == Loai).FirstOrDefault();

            if (TaiTDDG != true)
            {
                if (data == null)
                    data = GetDataTuKeHoachGanNhat(IdDonVi, IdKeHoachTDG, TaiTDDG, Loai, NamHoc);
                else
                    data = GetDataChoNamHocMoi(data, NamHoc);
            }

            return Ok(data);
        }
        private tblDuLieuNhaTruong GetDataTuKeHoachGanNhat(int IdDonVi, int IdKeHoachTDG, bool? TaiTDDG, string Loai, string NamHoc)
        {
            var kHGanNhat = db.tblKeHoachTDGs.Where(t => t.IdDonVi == IdDonVi && t.Id != IdKeHoachTDG)
                .OrderByDescending(t => t.NamHocKT).FirstOrDefault();

            var data = db.tblDuLieuNhaTruongs.Where(t => t.IdDonVi == IdDonVi && t.IdKeHoachTDG == kHGanNhat.Id
            && t.TaiTDDG == TaiTDDG && t.Loai == Loai).FirstOrDefault();

            if (data != null)
            {
                data = GetDataChoNamHocMoi(data, NamHoc);
            }

            return data;
        }
        private tblDuLieuNhaTruong GetDataChoNamHocMoi(tblDuLieuNhaTruong data, string NamHoc)
        {
            var NamHocBD = Convert.ToInt32(NamHoc.Split('-')[0]);
            var NamHocKT = Convert.ToInt32(NamHoc.Split('-')[1]);

            dynamic dulieu = JsonConvert.DeserializeObject(data.DuLieu);
            dynamic caccot = JsonConvert.DeserializeObject(data.CacCot);

            var NHMoiNhatBD = Convert.ToInt32(caccot[6].title.Value.Split('-')[0].Replace("Năm học", ""));
            var NHMoiNhatKT = Convert.ToInt32(caccot[6].title.Value.Split('-')[1]);

            if (NamHocBD <= NHMoiNhatBD && NamHocKT <= NHMoiNhatKT)
                return data;

            for (int i = 0; i < dulieu.Count; i++)
            {
                dulieu[i].RemoveAt(2);
                dulieu[i].Add("");
            }

            caccot.RemoveAt(2);
            caccot.Add(JToken.FromObject(new
            {
                title = "Năm học " + NamHocBD + "-" + NamHocKT,
                width = "200px",
            }));

            data.DuLieu = JsonConvert.SerializeObject(dulieu);
            data.CacCot = JsonConvert.SerializeObject(caccot);

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
