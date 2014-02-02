StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setup')
    
    var g = t.getGantt({
        viewPreset      : 'weekAndDayLetter',
        renderTo : Ext.getBody(),
        highlightWeekends : true,
        weekendsAreWorkdays : false
    });
    
    t.waitForEventsToRender(g, function() {
        var newTask = new g.taskStore.model({
            StartDate : g.getStart(),
            EndDate : g.getEnd(),
            Cls : 'foo'
        });
        g.taskStore.getRootNode().appendChild(newTask);
        t.hasCls(g.getSchedulingView().getElementFromEventRecord(newTask), 'foo', 'Found Cls class ok');
    })
})    
