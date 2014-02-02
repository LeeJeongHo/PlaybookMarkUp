StartTest(function(t) {

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        forceFit    : true,
        width       : 500,
        lockedGridConfig : { collapsed : true},
        plugins     : new Gnt.plugin.TaskContextMenu
    });
    var dep = g.dependencyStore.first();

    t.chain(
        { waitFor : 'tasksAndDependenciesToRender', args : g },
        { action : 'rightClick', target : function() { return g.getSchedulingView().getElementFromEventRecord(dep.getSourceTask()); } },

        { waitFor : 500 },
        { action : 'moveCursorTo', target : '>> #deleteDependencyMenu' },
        { waitFor : 'CQ', args : '#deleteDependencyMenu menuitem' },

        { action : 'click', target : '>> #deleteDependencyMenu menuitem' },
        { waitFor : 500 },

        // This provoked a crash
        { action : 'moveCursor', to : [10, 20] },

        function() {
            t.is(g.dependencyStore.indexOf(dep), -1, 'Should not find dependency in store after delete');
        }
    )
});
