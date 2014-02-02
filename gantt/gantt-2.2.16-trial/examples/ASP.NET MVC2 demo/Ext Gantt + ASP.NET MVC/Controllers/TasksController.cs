using System;
using System.Web.Mvc;
using Ext.Scheduler.Models;
using System.Linq;
using System.Linq.Expressions;
using System.Web.Script.Serialization;
using System.Data.Linq;
using System.Collections.Generic;

namespace Controllers {

    public class NestedTaskModel : Task
    {
        public List<NestedTaskModel> children = null;
        public bool expanded;

        public NestedTaskModel(Task t) {
            this.Id = t.Id == 0 ? null : t.Id;
            this.parentId = t.parentId;
            this.StartDate = t.StartDate;
            this.EndDate = t.EndDate;
            this.Duration = t.Duration;
            this.DurationUnit = t.DurationUnit;
            this.PercentDone = t.PercentDone;
            this.Priority = t.Priority;
            this.Name = t.Name;

            // Sencha NodeInterface properties
            this.index = t.index;
            this.leaf = t.leaf;
        }
    }

    public class TasksController : Controller
    {
        readonly DataClasses1DataContext _db = new DataClasses1DataContext();

        public JsonResult Get()
        {
            var rootTasks = _db.Tasks.Where(b => !b.parentId.HasValue);
            List<NestedTaskModel> roots = new List<NestedTaskModel>();

            foreach (Task cd in rootTasks)
            {
                NestedTaskModel n = new NestedTaskModel(cd);
                roots.Add(n);
                this.SetNodeChildren(n);
            }

            return this.Json(roots, JsonRequestBehavior.AllowGet);
        }

        public void SetNodeChildren(NestedTaskModel node)
        {
            var children = _db.Tasks.Where(b => b.parentId == node.Id);

            if (children.Count<Task>() > 0)
            {
                node.children = new List<NestedTaskModel>();

                foreach (Task t in children)
                {
                    NestedTaskModel n = new NestedTaskModel(t);
                    node.children.Add(n);
                    this.SetNodeChildren(n);
                }

                // Last step, sort children on the 'index' field
                node.children = node.children.OrderBy(a => a.index).ToList();
            }
            node.leaf = (node.children == null);
            node.expanded = !node.leaf;
        }

        public JsonResult Update(string taskdata)
        {
            var taskVals = (Task[])new JavaScriptSerializer().Deserialize<Task[]>(taskdata);

            foreach (Task vals in taskVals)
            {
                Task t = _db.Tasks.SingleOrDefault(b => b.Id == vals.Id);

                if (t != null)
                {
                    t.Name = vals.Name;
                    t.parentId = vals.parentId;
                    t.Duration = vals.Duration;
                    t.DurationUnit = vals.DurationUnit;
                    t.PercentDone = vals.PercentDone;
                    t.StartDate = vals.StartDate;
                    t.EndDate = vals.EndDate;
                    t.Priority = vals.Priority;
                    t.index = vals.index;
                    t.leaf = vals.leaf;
                }
            }
            _db.SubmitChanges();
            return this.Json(taskVals);
        }

        public JsonResult Delete(string taskdata)
        {
            var tasks = (Task[])new JavaScriptSerializer().Deserialize<Task[]>(taskdata);
            
            foreach (Task t in tasks)
            {
                Task task = _db.Tasks.SingleOrDefault(b => b.Id == t.Id);

                if (task != null)
                {
                    var deps = _db.Dependencies.Where(b => (b.To == t.Id || b.From == t.Id));
                    _db.Dependencies.DeleteAllOnSubmit(deps);
                    _db.Tasks.DeleteOnSubmit(task);
                }
            }
            _db.SubmitChanges();
            return this.Json(new { success = true });
        }

        public JsonResult Create(string taskdata)
        {
            var tasks = (Task[])new JavaScriptSerializer().Deserialize<Task[]>(taskdata);
            DataClasses1DataContext _db = new DataClasses1DataContext();
            _db.Tasks.InsertAllOnSubmit(tasks);
            _db.SubmitChanges(ConflictMode.ContinueOnConflict);
            return this.Json(tasks);
        }
    }
}
