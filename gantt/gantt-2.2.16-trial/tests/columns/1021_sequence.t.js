StartTest(function(t) {

    var gantt = t.getGantt({
        renderTo    : Ext.getBody(),
        taskStore   : new Gnt.data.TaskStore({ proxy : 'memory' }),
        columns : [
            {
                xtype : 'namecolumn'
            },
            // having extra column that relies on the same update mechanism is good for testing, 
            // because it causes additional side effects
            {
                xtype       : 'predecessorcolumn',
                useSequenceNumber : true,
                text        : 'Sequence predecessor'
            },
            {
                xtype : 'sequencecolumn'
            }
        ]
    });
    
    var verifySequentialOrder   = function (t, count) {
        for (var i = 0; i < count; i++)
            t.matchGridCellContent(gantt.lockedGrid, i, 2, i + 1, 'Sequence ok');
    }
    
    var taskStore   = gantt.taskStore
    var lockedGrid  = gantt.lockedGrid;
    var lockedView  = lockedGrid.getView()

    var id          = t.getLocatorById(taskStore)
    
    t.it('Re-ordering the last child should keep the sequence', function (t) {
        taskStore.setRootNode({
            expanded    : true,
            children    : [
                { Id      : 1, Name    : 1, leaf : true },
                { Id      : 2, Name    : 2, leaf : true },
                { Id      : 3, Name    : 3, leaf : true }
            ]
        })
        
        t.chain(
            { waitFor : 'rowsVisible', args : gantt },
            function (next) {
                taskStore.getRootNode().insertChild(0, id(3))
                
                verifySequentialOrder(t, 3)
            }
        )
    })
    
    t.it('Appending a child should keep the sequence', function (t) {
        taskStore.setRootNode({
            expanded    : true,
            children    : [
                { Id      : 1, Name    : 1, expanded : true, children : { Id : 2, Name : 2, leaf : true } },
                { Id      : 3, Name    : 3, expanded : true, children : { Id : 4, Name : 4, leaf : true } }
            ]
        })
        
        t.chain(
            { waitFor : 'rowsVisible', args : gantt },
            function (next) {
                id(1).appendChild({ Id : 5, Name : 5, leaf : true })
                
                verifySequentialOrder(t, 5)
            }
        )
    })

    
    t.chain(
        { waitFor : 'rowsVisible', args : gantt },

        function (next) {
            var locked      = gantt.lockedGrid;
            var lockedView  = locked.getView()
            var root        = gantt.taskStore.getRootNode();
            
            var id          = function (id) { return gantt.taskStore.getById(id) }

            t.it('Should render correct sequence code', function(t) {
                t.matchGridCellContent(locked, 0, 1, '1', '1');
                t.matchGridCellContent(locked, 1, 1, '2', '2');
                t.matchGridCellContent(locked, 2, 1, '3', '3');
                t.matchGridCellContent(locked, 3, 1, '4', '4');
                t.matchGridCellContent(locked, 4, 1, '5', '5');
                t.matchGridCellContent(locked, 5, 1, '6', '6');
                t.matchGridCellContent(locked, 6, 1, '9', '9');
            });

            t.it('Should render correct sequence code after remove leaf', function(t) {
                root.removeChild(root.childNodes[0]);
                t.matchGridCellContent(locked, 0, 1, '1', '1');
                t.matchGridCellContent(locked, 1, 1, '2', '2');
                t.matchGridCellContent(locked, 2, 1, '3', '3');
                t.matchGridCellContent(locked, 3, 1, '4', '4');
                t.matchGridCellContent(locked, 4, 1, '5', '5');
                t.matchGridCellContent(locked, 5, 1, '8', '8');
            });

            t.it('Should render correct sequence code after collapse', function(t) {
                root.childNodes[0].collapse();
                t.matchGridCellContent(locked, 0, 1, '1', '1');
                t.matchGridCellContent(locked, 1, 1, '5', '5');
                t.matchGridCellContent(locked, 2, 1, '8', '8');
            });

            t.it('Should render correct sequence code after remove branch', function(t) {
                root.removeChild(root.childNodes[1]);
                t.matchGridCellContent(locked, 0, 1, '1', '1');
                t.matchGridCellContent(locked, 1, 1, '5', '5');
            });

            t.it('Should render correct sequence code after add leaf', function(t) {
                root.insertChild(0, {
                    leaf : true
                });
                // same as original
                t.matchGridCellContent(locked, 0, 1, '1', '1');
                t.matchGridCellContent(locked, 1, 1, '2', '2');
                t.matchGridCellContent(locked, 2, 1, '6', '6');
            });

            t.it('Should render correct sequence code after add expanded branch', function(t) {
                root.insertChild(1, {
                    expanded : true,
                    children : [
                        {
                            leaf : true
                        }
                    ]
                });
                // same as original
                t.matchGridCellContent(locked, 0, 1, '1', '1');
                t.matchGridCellContent(locked, 1, 1, '2', '2');
                t.matchGridCellContent(locked, 2, 1, '3', '3');
                t.matchGridCellContent(locked, 3, 1, '4', '4');
                t.matchGridCellContent(locked, 4, 1, '8', '8');
            });
            
            t.it('Should show correct sequence code after re-ordering of the tasks', function(t) {
                root.insertChild(0, {
                    expanded    : true,
                    children    : [
                        {
                            leaf        : true,
                            Id          : 'Source',
                            Name        : 'Source'
                        },
                        {
                            leaf        : true,
                            Id          : 'Target',
                            Name        : 'Target'
                        }
                    ]
                });
                
                t.chain(
                    {
                        drag        : function () { return lockedView.getNode(id('Source')) },
                        to          : function () { return lockedView.getNode(id('Target')) },
                        toOffset    : [ '50%', '50%+3' ]
                    },
                    function () {
                        verifySequentialOrder(t, 4)
                    }
                )
            });
            
            t.iit('Should show correct sequence code after re-ordering of the tasks', function(t) {
                root.insertChild(0, {
                    leaf        : true,
                    Id          : 'Source1',
                    Name        : 'Source1'
                })
                root.insertChild(1, {
                    leaf        : true,
                    Id          : 'Target1',
                    Name        : 'Target1'
                })
                root.insertChild(2, {
                    leaf        : true,
                    Id          : 'Target2',
                    Name        : 'Target2'
                })
                
                verifySequentialOrder(t, 4)
                
                t.chain(
                    {
                        drag        : function () { return lockedView.getNode(id('Source1')) },
                        to          : function () { return lockedView.getNode(id('Target2')) },
                        toOffset    : [ '50%', '50%+3' ]
                    },
                    function () {
                        verifySequentialOrder(t, 4)
                    }
                )
            });
        }
    )
});
