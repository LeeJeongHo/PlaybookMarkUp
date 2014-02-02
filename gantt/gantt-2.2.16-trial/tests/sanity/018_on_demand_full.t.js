StartTest(function(t) {

    if (t.isOnline()) {
        //======================================================================================================================================================================================================================================================
        t.diag('Developers only test')

        return
    }

    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')

    Ext.Loader.setConfig({
        enabled             : true,
        disableCaching      : true
    });

    Ext.Loader.setPath('Sch', '../../ExtScheduler2.x/js/Sch')
    Ext.Loader.setPath('Gnt', '../js/Gnt')

    t.requireOk([
        'Gnt.column.AddNew',
        'Gnt.column.Duration',
        'Gnt.column.Effort',
        'Gnt.column.EndDate',
        'Gnt.column.PercentDone',
        'Gnt.column.Predecessor',
        'Gnt.column.ResourceAssignment',
        'Gnt.column.StartDate',
        'Gnt.column.Successor',
        'Gnt.column.WBS',

        'Gnt.plugin.DependencyEditor',
        'Gnt.plugin.Export',
        'Gnt.plugin.Printable',
        'Gnt.plugin.TaskContextMenu',
        'Gnt.plugin.TaskEditor',

        'Gnt.panel.Gantt'
    ], function () {
        var as = t.beginAsync();

        Ext.onReady(function() {
            t.endAsync(as);
            t.ok(Gnt.panel.Gantt, "Gnt.panel.Gantt is here")
            var gantt = t.getGantt();

            gantt.render(Ext.getBody());
            t.ok(gantt.el, 'Gantt has been rendered')
        })
    })
})    
