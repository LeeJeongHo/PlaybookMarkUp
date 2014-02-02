<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head runat="server">
    <title>Ext Gantt + ASP.NET MVC</title>
    
    <!--Ext JS CSS files-->
    <link href="http://cdn.sencha.com/ext/gpl/4.2.1/resources/css/ext-all.css" rel="stylesheet" type="text/css" />
    
    <!--Gantt CSS files-->
    <link href="/resources/css/sch-gantt-all.css" rel="stylesheet" type="text/css" />
    
    <!--Application CSS files-->
    <link href="/resources/css/style.css" rel="stylesheet" type="text/css" />
    
    <!--Ext JS files-->
    <script src="http://cdn.sencha.com/ext/gpl/4.2.1/ext-all.js" type="text/javascript"></script>
    
    <!--Gantt components-->
    <script type="text/javascript" src="/js/gnt-all-debug.js"></script>
    
    <!--Application files-->
    <script type="text/javascript" src="<% = Url.Content("~/js/App.js") %>"></script>
</head>
<body>
    <p>
        This is a simplified example showing how you can integrate the Ext Gantt with ASP.NET MVC. The example uses MVC2 as well as LINQ, and 
        changes are made locally until you hit the save button which sends the changes (as JSON) to the server. To see the traffic, open Firebug
        and the console tab and you will see every server call made.
    </p>
    <br />
    <br />
</body>
</html>