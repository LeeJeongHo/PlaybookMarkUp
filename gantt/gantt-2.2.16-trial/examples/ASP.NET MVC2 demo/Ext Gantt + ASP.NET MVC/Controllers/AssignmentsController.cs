using System;
using System.Web.Mvc;
using System.Linq;
using System.Linq.Expressions;
using Ext.Scheduler.Models;
using System.Web.Script.Serialization;

namespace Controllers {

    public class AssignmentsController : Controller
    {
        readonly DataClasses1DataContext _db = new DataClasses1DataContext();

        public JsonResult Get()
        {
            return this.Json(new { assignmentdata = _db.Assignments,
                                   resources = _db.Resources }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(string assignmentdata)
        {
            var deps = (Assignment[])new JavaScriptSerializer().Deserialize<Assignment[]>(assignmentdata);

            foreach (Assignment d in deps)
            {
                Assignment dep = _db.Assignments.SingleOrDefault(b => b.Id == d.Id);

                if (dep != null)
                {
                    _db.Assignments.DeleteOnSubmit(dep);
                }
            }
            _db.SubmitChanges();
            return this.Json(new { success = true });
        }

        public JsonResult Create(string assignmentdata)
        {
            var vals = (Assignment[])new JavaScriptSerializer().Deserialize<Assignment[]>(assignmentdata);

            foreach (Assignment dep in vals)
            {
                if (vals != null)
                {
                    _db.Assignments.InsertOnSubmit(dep);
                }
            }
            _db.SubmitChanges();
            return this.Json(new { success = true, assignmentdata = vals});
        }
    }
}
