StartTest(function(t) {
    var g = t.getGantt({
        forceFit    : true,
        renderTo    : Ext.getBody()
    });

    // Clicking a parent task bar should toggle it by default

    t.waitForEventsToRender(g, function () {
        t.willFireNTimes(g.taskStore, 'expand', 1);
        t.willFireNTimes(g.taskStore, 'collapse', 1);

        t.chain(
            { action : 'click', target : '.sch-gantt-parenttask-bar' },
            { action : 'click', target : '.sch-gantt-parenttask-bar' }
        );
    });
});    
