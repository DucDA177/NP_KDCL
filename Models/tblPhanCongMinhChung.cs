//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebApiCore.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class tblPhanCongMinhChung
    {
        public int Id { get; set; }
        public int STT { get; set; }
        public int IdDonVi { get; set; }
        public int IdKeHoachTDG { get; set; }
        public Nullable<int> IdTieuChi { get; set; }
        public Nullable<int> IdMinhChung { get; set; }
        public Nullable<int> Muc { get; set; }
        public string NguoiLuuGiu { get; set; }
        public string NguoiThuThap { get; set; }
        public Nullable<System.DateTime> TuNgay { get; set; }
        public Nullable<System.DateTime> DenNgay { get; set; }
        public string TrangThai { get; set; }
        public string GhiChu { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<bool> FInUse { get; set; }
    }
}
