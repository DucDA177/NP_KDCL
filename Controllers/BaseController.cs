using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApiCore.Models;

namespace WebApiCore.Controllers
{
    public class BaseController : ApiController
    {
        private WebApiDataEntities db = new WebApiDataEntities();
        public class itemTreeText
        {

            public int FLevel { get; set; }
            public int Id { get; set; }
            public string Ten { get; set; }
            public string Text { get; set; }
            public int index { get; set; }
        }
        [HttpGet]
        [Route("api/Base/GetDMDonVi")]
        public IHttpActionResult GetDMDonVi(string PhanLoai, string SearchKey)
        {
            var rs = (from dv in db.DMDonVis where dv.FInUse == true select dv);
            if (!string.IsNullOrWhiteSpace(PhanLoai))
            {
                rs = rs.Where(dv => dv.LoaiDonVi == PhanLoai);
            }
            if (!string.IsNullOrWhiteSpace(SearchKey))
            {
                rs = rs.Where(dv => dv.TenDonVi.Contains(SearchKey));
            }
            if (!string.IsNullOrWhiteSpace(PhanLoai) || !string.IsNullOrWhiteSpace(SearchKey))
            {
                return Ok(rs);
            }

            var DVSo = db.DMDonVis.FirstOrDefault(s => s.LoaiDonVi == "SO");
            ArrayList DonViList = new ArrayList();
            Stack sTree = new Stack();
            itemTreeText item = new itemTreeText()
            {
                Id = DVSo.Id,
                Ten = DVSo.TenDonVi,
                FLevel = 0,
                index = 1,
                Text = "",
            };
            sTree.Push(item);
            while (sTree.Count > 0)
            {
                itemTreeText tmp = (itemTreeText)sTree.Pop();
                string Text = tmp.Text;
                var o = new
                {
                    Id = tmp.Id,
                    code = tmp.Id,
                    TenDonVi = Text+" " + tmp.Ten,
                };
                DonViList.Add(o);
                var orgs = db.DMDonVis.Where(x => x.IDDVCha == tmp.Id).ToList();
                for (int i = orgs.Count() - 1; i >= 0; i--)
                {
                    Text = tmp.Text + (i + 1).ToString() + ".";
                    itemTreeText itemO = new itemTreeText()
                    {
                        Id = orgs[i].Id,
                        Ten = orgs[i].TenDonVi,
                        FLevel = tmp.FLevel + 1,
                        index = i + 1,
                        Text = Text,
                    };
                    sTree.Push(itemO);
                }

            }

            return Ok(DonViList);
        }
    }
}
