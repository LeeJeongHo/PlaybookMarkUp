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
        'Gnt.column.PercentDone',
        'Gnt.column.StartDate',
        'Gnt.column.EndDate',
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
