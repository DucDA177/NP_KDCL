using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApiCore.Models;

namespace WebApiCore.Commons
{
    public class Constants
    {
        #region nhóm supper admin
        public const string SUPPERADMIN = "SUPPERADMIN";
        #endregion
        #region vai trò supper admin
        public const string SUPPER = "SUPER";
        #endregion
        public const string defautPass = "123abc";

        #region Trạng thái thông báo
        public const string SoanThongBao = "ST";
        public const string Gui = "SEND";
        #endregion
        #region Trang Thai Ke hoach danh gia ngoai
        public const string DA_LAP_KE_HOACH_NGOAI = "DA_LAP_KE_HOACH_DG_NGOAI";
        public const string DANG_THUC_HIEN_KE_HOACH_NGOAI = "DANG_THUC_HIEN_KE_HOACH_DG_NGOAI";
        public const string DANG_DUNG_KE_HOACH_NGOAI = "DANG_DUNG_KE_HOACH_DG_NGOAI";
        public const string HOAN_THANH_KE_HOACH_NGOAI = "HOAN_THANH_KE_HOACH_DG_NGOAI";
        #endregion
        #region Trang Thai lap bao cao
        public const string DANG_SOAN = "DANG_SOAN";
        public const string HOAN_THANH = "HOAN_THANH";
        #endregion
    }
}