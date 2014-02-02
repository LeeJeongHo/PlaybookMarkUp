using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using Ext_Gantt_CRUD_Demo.models;
using System.Web.Script.Serialization;
using System.Data.Linq;

namespace Ext_Gantt_CRUD_Demo
{
    /// <summary>
    /// Summary description for Tasks
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [ScriptService]
    public class Tasks : System.Web.Services.WebService
    {
        public class NestedTaskModel : Task
        {
            public List<NestedTaskModel> children = null;
            public bool leaf = true;
            public string PhantomParentId;
            public string PhantomId;

            public NestedTaskModel() : base() { }

            public NestedTaskModel(Task t)
            {
                this.Id = t.Id;
                this.parentId = t.parentId;
                this.StartDate = t.StartDate;
                this.EndDate = t.EndDate;
                this.Duration = t.Duration;
                this.DurationUnit = t.DurationUnit;
                this.PercentDone = t.PercentDone;
                this.Priority = t.Priority;
                this.Name = t.Name;
                this.index = t.index;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public object Get()
        {
            DataClasses1DataContext _db = new DataClasses1DataContext();
            var rootTasks = _db.Tasks.Where(b => !b.parentId.HasValue);
            List<NestedTaskModel> roots = new List<NestedTaskModel>();

            foreach (Task cd in rootTasks)
            {
                NestedTaskModel n = new NestedTaskModel(cd);
                roots.Add(n);
                this.SetNodeChildren(n);
            }

            return roots;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Object Create(NestedTaskModel[] jsonData)
        {
            DataClasses1DataContext _db = new DataClasses1DataContext();
            foreach (NestedTaskModel t in jsonData)
            {
                Task task = new Task();
                task.parentId = t.parentId;
                task.StartDate = t.StartDate;
                task.EndDate = t.EndDate;
                task.Duration = t.Duration;
                task.DurationUnit = t.DurationUnit;
                task.PercentDone = t.PercentDone;
                task.Priority = t.Priority;
                task.Name = t.Name;
                task.index = t.index;

                _db.Tasks.InsertOnSubmit(task);

                _db.SubmitChanges(ConflictMode.ContinueOnConflict);

                int? id = task.Id;
                Task[] children = (from _t
                                   in jsonData
                                   where _t.PhantomParentId != "" && _t.PhantomParentId == t.PhantomId
                                   select _t).ToArray();

                foreach (Task child in children)
                {
                    child.parentId = id;
                }

                this.Update(children);
            }

            return jsonData;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Object Update(IEnumerable<Task> jsonData)
        {
            DataClasses1DataContext _db = new DataClasses1DataContext();
            foreach (Task vals in jsonData)
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
                }
            }
            _db.SubmitChanges(ConflictMode.ContinueOnConflict);
            return jsonData;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Object Delete(IEnumerable<Task> jsonData)
        {
            DataClasses1DataContext _db = new DataClasses1DataContext();
            foreach (Task t in jsonData)
            {
                Task task = _db.Tasks.SingleOrDefault(b => b.Id == t.Id);

                if (task != null)
                {
                    var deps = _db.Dependencies.Where(b => (b.To == t.Id || b.From == t.Id));
                    _db.Dependencies.DeleteAllOnSubmit(deps);
                    _db.Tasks.DeleteOnSubmit(task);
                }

                // Also clear any children of this task recursively
                IEnumerable<Task> children = _db.Tasks.Where<Task>(b => (b.parentId == t.Id));
                this.Delete(children);
            }
            _db.SubmitChanges();
            return new { success = true };
        }

        public void SetNodeChildren(NestedTaskModel node)
        {
            DataClasses1DataContext _db = new DataClasses1DataContext();
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
        }
    }
}
