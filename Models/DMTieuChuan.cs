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
    
    public partial class DMTieuChuan
    {
        public int Id { get; set; }
        public int STT { get; set; }
        public int ThuTu { get; set; }
        public int IdQuyDinh { get; set; }
        public string NoiDung { get; set; }
        public string GhiChu { get; set; }
        public Nullable<bool> YCDanhGia { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<bool> FInUse { get; set; }
    }
}
