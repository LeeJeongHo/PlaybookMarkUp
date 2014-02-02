StartTest(function(t) {
    t.diag('Changing the StartDate of a task with one parent should cause one update for each.')
    
    var gantt = t.getGantt({
        renderTo : Ext.getBody(),
        columns : [{ xtype : 'treecolumn'}, { xtype : 'startdatecolumn' }],
        plugins : Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 1 }),
        cascadeChanges : false
    });
   
    t.waitForEventsToRender(gantt, function() {
        var view = gantt.getSchedulingView(),
            ts = gantt.taskStore,
            root = ts.getRootNode(),
            task = root.firstChild.firstChild;
        
        t.chain(
            { action : 'click', target : t.getCell(gantt.lockedGrid, 1, 1) }, 
        
            function(next) {
                t.waitForSelectorAt(t.currentPosition, 'input[type=text]', next);
            },

            function(next, foundEl) {
                foundEl.value = '';
                t.nbrUpdates = 0;
                ts.on('update', function() { t.nbrUpdates++; });
                t.type(foundEl, '02/04/2010[ENTER]', next);
            },

            { action : 'wait', delay : 100 },

            function(next) {
                t.is(t.nbrUpdates, 2, '2 updates fired, child and parent');
                var parent = t.getFirstParentTask(gantt);
                parent[parent.isExpanded() ? 'collapse' : 'expand']();
                next()
            },

            { action : 'wait', delay : 100 },

            function() {
                var parent = t.getFirstParentTask(gantt);
                parent[parent.isExpanded() ? 'collapse' : 'expand']();
            }
        );
    })
})    
