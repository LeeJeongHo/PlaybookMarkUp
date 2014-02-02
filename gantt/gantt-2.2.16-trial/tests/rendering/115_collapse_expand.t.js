StartTest(function(t) {
    
    var gantt = t.getGantt({
        renderTo                : Ext.getBody(),
        enableAnimations        : false
    });
    
    t.waitForEventsToRender(gantt, function () {
        gantt.collapseAll();
        gantt.expandAll();
        t.pass('collapseAll/expandAll executed ok');
    });
})    

