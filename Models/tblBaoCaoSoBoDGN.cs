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
    
    public partial class tblBaoCaoSoBoDGN
    {
        public int Id { get; set; }
        public int STT { get; set; }
        public int IdDonVi { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string NhanXetHinhThuc { get; set; }
        public string NhanXetNoiDung { get; set; }
        public string TieuChiChuaDanhGia { get; set; }
        public string DeXuat { get; set; }
        public string TrangThai { get; set; }
        public string GhiChu { get; set; }
        public Nullable<int> IdKeHoachDGN { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<bool> FInUse { get; set; }
    }
}
