using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApiCore.Models
{
    public  partial  class FilterModel
    {
        public string SearchKey { get; set; }
        public string FBranchCode { get; set; }
        public string RoleView { get; set; }
        public DateTime? NgayTu { get; set; }
        public DateTime? NgayDen { get; set; }
        private int pageNumber;
        public bool? GetAll { get; set; }
        public int PageNumber
        {
            get
            {
                return pageNumber == 0 ? 1 : pageNumber;
            }
            set
            {
                pageNumber = value;
            }
        }
        private int pageSize;
        public int PageSize
        {
            get
            {
                return pageSize == 0 ? 30 : pageSize;
            }
            set
            {
                pageSize = value;
            }
        }

    }
}