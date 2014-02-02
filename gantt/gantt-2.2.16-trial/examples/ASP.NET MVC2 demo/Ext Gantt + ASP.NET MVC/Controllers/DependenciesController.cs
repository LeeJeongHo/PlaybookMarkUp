using System;
using System.Web.Mvc;
using Ext.Scheduler.Models;
using System.Linq;
using System.Linq.Expressions;
using System.Web.Script.Serialization;

namespace Controllers {

    public class DependenciesController : Controller
    {
        readonly DataClasses1DataContext _db = new DataClasses1DataContext();

        public JsonResult Get()
        {
            return this.Json(_db.Dependencies, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(string dependencydata)
        {
            var deps = (Dependency[])new JavaScriptSerializer().Deserialize<Dependency[]>(dependencydata);

            foreach (Dependency d in deps)
            {
                Dependency dep = _db.Dependencies.SingleOrDefault(b => b.Id == d.Id);

                if (dep != null)
                {
                    _db.Dependencies.DeleteOnSubmit(dep);
                }
            }
            _db.SubmitChanges();
            return this.Json(new { success = true });
        }

        public JsonResult Create(string dependencydata)
        {
            var vals = (Dependency[])new JavaScriptSerializer().Deserialize<Dependency[]>(dependencydata);

            foreach (Dependency dep in vals)
            {
                if (vals != null)
                {
                    _db.Dependencies.InsertOnSubmit(dep);
                }
            }
            _db.SubmitChanges();
            return this.Json(new { success = true, dependencydata = vals });
        }
    }
}
