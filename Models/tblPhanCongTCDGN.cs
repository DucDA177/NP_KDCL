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
    
    public partial class tblPhanCongTCDGN
    {
        public int Id { get; set; }
        public Nullable<int> IdKeHoachDGN { get; set; }
        public string UserName { get; set; }
        public int IdThanhVienDGN { get; set; }
        public int IdTieuChi { get; set; }
        public int IdHoiDongDGN { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<bool> FInUse { get; set; }
    }
}
