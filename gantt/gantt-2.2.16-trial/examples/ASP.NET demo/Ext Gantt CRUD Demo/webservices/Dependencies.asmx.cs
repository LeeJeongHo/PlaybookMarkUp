using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using Ext_Gantt_CRUD_Demo.models;
using System.Web.Script.Serialization;
using System.Data.Linq;

namespace Ext_Gantt_CRUD_Demo.webservices
{
    /// <summary>
    /// Summary description for Dependencies
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class Dependencies : System.Web.Services.WebService
    {
        readonly DataClasses1DataContext _db = new DataClasses1DataContext();

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet=true)]
        public Object Get()
        {
            return _db.Dependencies;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Object Create(Dependency[] jsonData)
        {
            _db.Dependencies.InsertAllOnSubmit(jsonData);
            _db.SubmitChanges(ConflictMode.ContinueOnConflict);
            return jsonData;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Object Delete(Dependency[] jsonData)
        {
            if (jsonData != null)
            {
                foreach (Dependency d in jsonData) {
                    Dependency dep = _db.Dependencies.SingleOrDefault(b => b.Id == d.Id);
                    _db.Dependencies.DeleteOnSubmit(dep);
                }
            }
            _db.SubmitChanges();
            return new { success = true };
        }
    }
}
