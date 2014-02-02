StartTest(function(t) {
    t.diag('Testing lockedGridConfig and schedulerConfig settings');

    var s1 = t.getGantt({
        height : 200,
        width : 600,
        dependencyStore : new Gnt.data.DependencyStore(),
        lockedGridConfig : {
            collapsible : true,
            collapsed : true
        },
        renderTo        : Ext.getBody()
    });

    var s2 = t.getGantt({
        height : 200,
        width : 600,
        dependencyStore : new Gnt.data.DependencyStore(),
        schedulerConfig : {
            collapsible : true,
            collapsed : true
        },
        renderTo        : Ext.getBody()
    });

    t.waitForComponentVisible(s1, function() {
        t.is(s1.lockedGrid.getWidth(), 0, 'Locked grid initially collapsed');
        t.isApprox(s1.normalGrid.getWidth(), 580, 'Scheduler grid initially expanded fully');
    })

    t.waitForComponentVisible(s2, function() {
        // The normal grid collapse is deferred during init
        t.waitFor(500, function() {
            t.isApprox(s2.lockedGrid.getWidth(), 580, 'Locked grid initially expanded fully');
            t.ok(s2.normalGrid.getCollapsed(), 'Scheduler grid initially collapsed');
        })
    })
})    

