describe('After indent, row selection/focus should be kept', function(t) {

    var g = t.getGantt({
        lockedGridConfig    : {
            width       : 100
        },
        renderTo        : Ext.getBody(),
        taskStore : new Gnt.data.TaskStore({
            proxy : 'memory',
            root : {
                children : [
                    { Id : 1, leaf : true }, { Id : 2, leaf : true }
                ]
            }
        })
    });

    var id      = function (id) { return g.taskStore.getById(id) }
    
    var task2   = id(2)
    
    t.chain(
        { waitFor : 'RowsVisible' },

        function(next) {
            g.lockedGrid.view.focusRow(task2);

            t.is(document.activeElement, g.lockedGrid.view.getNode(task2))
            g.taskStore.indent(task2);

            next()
        },

        { waitFor : 100 },

        function (next) {
            var activeElement   = t.activeElement()
            
            // The Ext JS table panel will focus one of the locked/normal row els
            t.is(activeElement, g.lockedGrid.view.getNode(task2), "Correct row re-focused after indent")
            
            next()
        },
        
        function(next) {
            g.normalGrid.view.focusRow(task2);

            t.is(document.activeElement, g.normalGrid.view.getNode(task2))
            g.taskStore.outdent(task2);

            next()
        },

        { waitFor : 100 },

        function (next) {
            var activeElement   = t.activeElement()
            
            // The Ext JS table panel will focus one of the locked/normal row els
            t.is(activeElement, g.normalGrid.view.getNode(task2), "Correct row re-focused after indent")
        }
    )
})
