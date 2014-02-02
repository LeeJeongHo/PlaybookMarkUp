StartTest(function(t) {
    t.diag('Testing loading Gantt with collapsed normal/locked grids');

    var g1 = t.getGantt({
        layout : 'border',
        height : 200,
        width : 600,
        lockedGridConfig : {
            collapsible : true,
            collapsed : true
        },
        renderTo        : Ext.getBody()
    });
    
    var g2 = t.getGantt({
        layout : 'border',
        height : 200,
        width : 600,
        schedulerConfig : {
            collapsible : true,
            collapsed : true
        },
        renderTo        : Ext.getBody()
    });

    t.waitForComponentVisible(g1, function() {
        t.is(g1.lockedGrid.getWidth(), 0, 'Locked grid initially collapsed');
        t.isApprox(g1.normalGrid.getWidth(), 580, 'Scheduler grid initially expanded fully');
    });
    
    t.waitForComponentVisible(g2, function() {  
        t.waitFor(500, function() {
            t.isApprox(g2.lockedGrid.getWidth(), 580, 'Locked grid initially expanded fully');
            t.ok(g2.normalGrid.getCollapsed(), 'Scheduler grid initially collapsed');
        });   
    });   
});