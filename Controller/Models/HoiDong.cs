using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApiCore.Models;

namespace WebApiCore.Models
{
    public class HoiDong
    {
        public tblDanhmuc cv { get; set; }
        public tblDanhmuc nv { get; set; }
        public UserProfile us { get; set; }
    }
    public class HoiDongTDG : HoiDong
    {
        public tblHoiDong hd { get; set; }
    }
    public class HoiDongDGN : HoiDong
    {
        public tblHoiDongDGN hd { get; set; }
    }
}