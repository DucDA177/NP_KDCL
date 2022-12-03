using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApiCore.Models
{
    public class DoanDGNRequest
    {
        public tblDoanDGN DoanDGN { get; set; }
        public List<TruongDGNViewModel> TruongDGN { get; set; }
    }
    public class TruongDGNViewModel
    {
        //Id = IdTruong
        public int? Id { get; set; }
        public string TenDonVi { get; set; }
        public int? IdDoanDGN { get; set; }
        public int? IdKeHoachTDG { get; set; }
        public DateTime? LamViecTu { get; set; }
        public DateTime? LamViecDen { get; set; }
        public string TruongDoan { get; set; }
    }
}