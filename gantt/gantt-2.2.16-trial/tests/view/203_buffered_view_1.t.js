StartTest(function(t) {
    function getBufferedGantt(config) {

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            // sorting slow downs the initial loading/rendering time for big trees
            sortOnLoad  : false,
            
            proxy       : {
                type : 'memory',
                data : t.getLargeDataset()
            }
        });

        var gantt = t.getGantt(Ext.apply({
            taskStore   : taskStore,
            rightLabelField : 'Name',
            width       : 400,
            columns: [
                {
                    xtype       : 'treecolumn',
                    header      : 'Tasks',
                    sortable    : true,
                    dataIndex   : 'Id',
                    width       : 150,
                    editor      : {}
                }
            ],
            plugins : ['bufferedrenderer'],
            renderTo    : Ext.getBody()
        }, config || {}));

        return gantt;
    }
    
    var gantt = getBufferedGantt();
    var schedulingView;
    var bottomScroll;
    
    var pass    = 1;
    
    var steps = [
        function (next) {
            switch (pass) {
                case 1 : t.diag("Testing not collapsed case"); break;
                case 2 : t.diag("Testing normal grid - collapsed"); break;
                case 3 : t.diag("Testing locked grid - collapsed"); break;
            }
            
            next()
        },
        {
            waitFor     : 'CompositeQuery',
            args        : 'ganttpanel => .x-grid-row'
        },
        {
            // it seems shortly after initial rendering, the "scrollTop" position of the buffered schedulingView will be reset to 0
            // need to wait some time before modifiying it
            waitFor     : 300
        },
        function (next) {
            // If normal grid is collapsed, scroll the locked grid
            // https://www.assembla.com/spaces/bryntum/support/tickets/268
            schedulingView      = gantt.normalGrid.getCollapsed() ? gantt.lockedGrid.view : gantt.getSchedulingView();
            
            var el              = schedulingView.el;
            
            bottomScroll        = t.scrollVerticallyTo(el, el.dom.scrollHeight, 300, next)
        },
        {
            // processing of scrolling is async, need to wait again
            waitFor     : 300
        },
        function (next) {
            // required, otherwise there will not be any visible rows inside the grid if it was initially collapsed
            gantt.lockedGrid.expand();
            gantt.normalGrid.expand();
            next();
        },

        { waitFor : 300 },

        function(next) {
            var schedulingViewEl    = schedulingView.el
            var lastNormalRow       = schedulingView.body.down('tr:last-child');
            var lastLockedRow       = gantt.lockedGrid.view.body.down('tr:last-child')

            t.is(schedulingView.getRecord(lastNormalRow.dom).getId(), 999, 'Found last record row in scheduler schedulingView');
            
            t.is(schedulingViewEl.dom.scrollTop, bottomScroll, 'Should scroll and remain at the bottom of the view el');

            t.like(lastLockedRow.dom.textContent, '999', 'Found last record row in locked schedulingView');
            
            pass++;
            
            if (pass == 2) {
                gantt.destroy();

                // Replay same scenario, with normal grid collapsed
                // http://www.assembla.com/spaces/bryntum/support/tickets/268
                gantt = getBufferedGantt({
                    lockedGridConfig : {
                        collapsible : true
                    },
                    normalGridConfig : {
                        collapsed : true,
                        collapsible : true
                    }
                });
                t.chain(steps);
            } else if (pass == 3) {
                gantt.destroy();

                // Replay same scenario, with locked grid collapsed
                // https://www.assembla.com/spaces/bryntum/tickets/409
                gantt = getBufferedGantt({
                    lockedGridConfig : {
                        collapsed : true,
                        collapsible : true
                    },
                    normalGridConfig : {
                        collapsible : true
                    }
                });
                
                t.chain(steps);
            }
        }
    ];

    t.chain(steps);
})    

