using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    [Authorize]
    public class BaoCaoController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();

        [HttpGet]
        [Route("api/BaoCao/TongHopKQDG")]
        public IHttpActionResult TongHopKQDG(int IdDonVi, int IdKeHoachTDG)
        {
            var data = (from dgtc in db.tblDanhGiaTieuChis
                        join tchi in db.DMTieuChis
                        on dgtc.IdTieuChi equals tchi.Id
                        join tchuan in db.DMTieuChuans
                        on tchi.IdTieuChuan equals tchuan.Id
                        where dgtc.IdDonVi == IdDonVi && dgtc.IdKeHoachTDG == IdKeHoachTDG
                        select new
                        {
                            dgtc.IdDonVi,
                            dgtc.IdKeHoachTDG,
                            dgtc.KQDatA,
                            dgtc.KQDatB,
                            dgtc.KQDatC,
                            dgtc.KQDatMuc,
                            IdTieuChi = tchi.Id,
                            TenTieuChi = tchi.NoiDung,
                            TTTieuChi = tchi.ThuTu,
                            IdTieuChuan = tchuan.Id,
                            TenTieuChuan = tchuan.NoiDung,
                            TTTieuChuan = tchuan.ThuTu
                        }).OrderBy(t => t.TTTieuChuan);


            return Ok(data);
        }

        [HttpGet]
        [Route("api/BaoCao/GetDataDLNhaTruong")]
        public IHttpActionResult GetDataDLNhaTruong(int IdDonVi, int IdKeHoachTDG)
        {
            var data = db.tblDuLieuNhaTruongs.Where(t => t.IdDonVi == IdDonVi && t.IdKeHoachTDG == IdKeHoachTDG);

            return Ok(data);
        }

        [HttpGet]
        [Route("api/BaoCao/GetThongTinDonVi")]
        public IHttpActionResult GetThongTinDonVi(int IdDonVi)
        {
            var data = (from dv in db.DMDonVis
                        join dvc in db.DMDonVis
                        on dv.IDDVCha equals dvc.Id
                        join tinh in db.Areas.Where(t => t.Type == "TINH" && t.FInUse == true)
                        on dv.IDTinh equals tinh.FCode
                        join huyen in db.Areas.Where(t => t.Type == "HUYEN" && t.FInUse == true)
                        on dv.IDHuyen equals huyen.FCode
                        join xa in db.Areas.Where(t => t.Type == "XA" && t.FInUse == true)
                        on dv.IDXa equals xa.FCode
                        where dv.FInUse == true && dv.Id == IdDonVi
                        select new
                        {
                            TenDonVi = dv.TenDonVi,
                            TenDonViCha = dvc.TenDonVi,
                            Tinh = tinh.FName,
                            Huyen = huyen.FName,
                            Xa = xa.FName,
                            CongLap = dv.LoaiHinh == "Công lập" ? "X" : "",
                            TuThuc = dv.LoaiHinh == "Tư thục" ? "X" : "",
                            HieuTruong = dv.TenLanhDao,
                            DienThoai = dv.DienThoai,
                            Fax = dv.Fax,
                            Website = dv.Website,
                            SoDiemTruong = dv.SoDiemTruong,
                            ThongTinKhac = dv.ThongTinKhac
                        }).FirstOrDefault();
            return Ok(data);
        }

        [HttpGet]
        [Route("api/BaoCao/LoadPhuLucMinhChung")]
        public IHttpActionResult LoadPhuLucMinhChung(int IdDonVi, int IdKeHoachTDG)
        {
            var result = db.tblMinhChungs.Where(t => t.IdDonVi == IdDonVi && t.IdKeHoachTDG == IdKeHoachTDG
           && t.FInUse == true).OrderBy(t => t.Ma);

            return Ok(result);
        }

        [HttpGet]
        [Route("api/BaoCao/LoadBaoCaoTCTC")]
        public IHttpActionResult LoadBaoCaoTCTC(int IdDonVi, int IdKeHoachTDG, int IdQuyDinh)
        {
            List<BaoCaoTieuChuan> result = new List<BaoCaoTieuChuan>();
            var lsTieuChuan = db.DMTieuChuans.Where(t => t.IdQuyDinh == IdQuyDinh
            && t.FInUse == true && t.YCDanhGia == true)
                .OrderBy(t => t.ThuTu);
            foreach (var tchuan in lsTieuChuan)
            {
                BaoCaoTieuChuan bctchuan = new BaoCaoTieuChuan();
                bctchuan.ThuTu = tchuan.ThuTu;
                bctchuan.TenTieuChuan = tchuan.NoiDung;
                bctchuan.MoDau = db.tblMoDauKetLuanTCs.Where(t => t.IdDonVi == IdDonVi
                && t.IdKeHoachTDG == IdKeHoachTDG && t.IdTieuChuan == tchuan.Id && t.Loai == "MD")
                    .FirstOrDefault()?.NoiDung;
                bctchuan.KetLuan = db.tblMoDauKetLuanTCs.Where(t => t.IdDonVi == IdDonVi
                && t.IdKeHoachTDG == IdKeHoachTDG && t.IdTieuChuan == tchuan.Id && t.Loai == "KL")
                    .FirstOrDefault()?.NoiDung;

                List<BaoCaoTieuChi> resultTieuChi = new List<BaoCaoTieuChi>();
                var lsTieuChi = db.DMTieuChis.Where(t => t.IdTieuChuan == tchuan.Id
                && t.FInUse == true && t.YCDanhGia == true).OrderBy(t => t.ThuTu); ;

                foreach (var tchi in lsTieuChi)
                {
                    BaoCaoTieuChi bctchi = new BaoCaoTieuChi();
                    bctchi.ThuTu = tchi.ThuTu;
                    bctchi.TenTieuChi = tchi.NoiDung;
                    bctchi.NoiDung1 = tchi.NoiDungA;
                    bctchi.NoiDung2 = tchi.NoiDungB;
                    bctchi.NoiDung3 = tchi.NoiDungC;

                    var dgtc = db.tblDanhGiaTieuChis.Where(t => t.IdDonVi == IdDonVi && t.IdKeHoachTDG == IdKeHoachTDG
                    && t.IdTieuChi == tchi.Id && t.FInUse == true).FirstOrDefault();
                    if (dgtc != null)
                    {
                        bctchi.Mota1 = dgtc.MoTaA;
                        bctchi.Mota2 = dgtc.MoTaB;
                        bctchi.Mota3 = dgtc.MoTaC;
                        bctchi.DiemManh = dgtc.DiemManh;
                        bctchi.Diemyeu = dgtc.DiemYeu;
                        bctchi.KHCaiTienChatLuong = dgtc.KeHoachCaiTien;
                        bctchi.KQDatMuc = dgtc.KQDatMuc;
                        bctchi.DatMuc1 = dgtc.KQDatA;
                        bctchi.DatMuc2 = dgtc.KQDatB;
                        bctchi.DatMuc3 = dgtc.KQDatC;
                    }
                    resultTieuChi.Add(bctchi);
                }

                bctchuan.ListTieuChi = resultTieuChi;
                bctchuan.TongTieuChi = resultTieuChi.Count;
                bctchuan.TchiDatMuc1 = resultTieuChi.Where(t => t.DatMuc1 == true).Count();
                bctchuan.TchiDatMuc2 = resultTieuChi.Where(t => t.DatMuc2 == true).Count();
                bctchuan.TchiDatMuc3 = resultTieuChi.Where(t => t.DatMuc3 == true).Count();

                result.Add(bctchuan);
            }

            return Ok(result);
        }
        public class BaoCaoTieuChuan
        {
            public int ThuTu { get; set; }
            public string TenTieuChuan { get; set; }
            public string MoDau { get; set; }
            public string KetLuan { get; set; }
            public List<BaoCaoTieuChi> ListTieuChi { get; set; }
            public int TongTieuChi { get; set; }
            public int TchiDatMuc1 { get; set; }
            public int TchiDatMuc2 { get; set; }
            public int TchiDatMuc3 { get; set; }
        }
        public class BaoCaoTieuChi
        {
            public int ThuTu { get; set; }
            public string TenTieuChi { get; set; }
            public string NoiDung1 { get; set; }
            public string NoiDung2 { get; set; }
            public string NoiDung3 { get; set; }
            public string Mota1 { get; set; }
            public string Mota2 { get; set; }
            public string Mota3 { get; set; }
            public string DiemManh { get; set; }
            public string Diemyeu { get; set; }
            public string KHCaiTienChatLuong { get; set; }
            public int? KQDatMuc { get; set; }
            public bool? DatMuc1 { get; set; }
            public bool? DatMuc2 { get; set; }
            public bool? DatMuc3 { get; set; }
        }

        [HttpGet]
        [Route("api/BaoCao/LoadBieuDoTCTCDatMuc")]
        public IHttpActionResult LoadBieuDoTCTCDatMuc(int IdDonVi, int IdKeHoachTDG, int IdQuyDinh)
        {
            List<TCTCDatMuc> result = new List<TCTCDatMuc>();
            var lsTieuChuan = db.DMTieuChuans.Where(t => t.IdQuyDinh == IdQuyDinh
            && t.FInUse == true && t.YCDanhGia == true)
                .OrderBy(t => t.ThuTu);
            foreach (var item in lsTieuChuan)
            {
                TCTCDatMuc tchuan = new TCTCDatMuc();
                tchuan.category = "Tiêu chuẩn " + item.ThuTu;

                var itemTchi = from dgtc in db.tblDanhGiaTieuChis
                               join tchi in db.DMTieuChis
                               on dgtc.IdTieuChi equals tchi.Id
                               where dgtc.IdDonVi == IdDonVi && dgtc.IdKeHoachTDG == IdKeHoachTDG
                               && tchi.IdTieuChuan == item.Id
                               select dgtc;
                tchuan.first = itemTchi.Where(x => x.KQDatA == true).Count();
                tchuan.second = itemTchi.Where(x => x.KQDatB == true).Count();
                tchuan.third = itemTchi.Where(x => x.KQDatC == true).Count();

                result.Add(tchuan);
            }

            return Ok(result);
        }

        public class TCTCDatMuc
        {
            public string category { get; set; }
            public int first { get; set; }
            public int second { get; set; }
            public int third { get; set; }
        }
    }
}
