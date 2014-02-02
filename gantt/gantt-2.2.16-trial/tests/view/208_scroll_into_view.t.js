StartTest(function (t) {
    var gantt = t.getGantt({
        renderTo    : Ext.getBody(),
        startDate   : new Date(2010, 1, 1),
        endDate     : new Date(2011, 1, 1),
        viewPreset  : 'monthAndYear',
        height      : 200,
        width       : 500,
        columns     : [{ xtype : 'treecolumn', width : 50 }],
        taskStore  : new Gnt.data.TaskStore({
            root : {
                children : [
                    {
                        Name        : 'foo',
                        leaf        : true,
                        StartDate   : new Date(2010, 10, 1),
                        EndDate     : new Date(2010, 11, 1)
                    }
                ]
            }
        })
    });

    t.it('should support scrollIntoView', function(t) {
        t.chain(
            { waitFor : 'RowsVisible', args : gantt },

            function(next) {
                var view = gantt.getSchedulingView(),
                    viewEl = view.el;

                t.waitForScrollLeftChange(viewEl, next);
                view.scrollEventIntoView(gantt.taskStore.getRootNode().firstChild);
            },

            function (next, scrollValue) {
                t.isGreater(scrollValue, 0, 'Scrolled right direction');

                t.waitFor(300, next);
            },

            function() {
                var eventEl = gantt.el.down('.sch-gantt-task-bar');
                t.ok(eventEl, 'Should find event el in the DOM');

                t.elementIsTopElement(eventEl, true, 'Should find event visible in the viewport');
            }
        );
    });

    t.it('should support scrollIntoView if target node is in a collapsed root', function(t) {
        t.chain(
            function(next) {
                var view = gantt.getSchedulingView(),
                    task = gantt.taskStore.getRootNode().firstChild,
                    viewEl = view.el;

                gantt.taskStore.getRootNode().collapse();

                gantt.setTimeSpan(new Date(2009, 1, 1), new Date(2010, 1, 1));
                view.scrollEventIntoView(task);
                next()
            },
            { waitFor : 500 },

            function () {
                var task = gantt.taskStore.getRootNode().firstChild;
                var eventEl = gantt.el.down('.sch-gantt-task-bar');

                t.ok(eventEl, 'Should find event el in the DOM');
                t.isLess(gantt.getStartDate(), task.getStartDate(), 'Should find start date in axis');
                t.isGreater(gantt.getEndDate(), task.getEndDate(), 'Should find end date in axis');
                t.elementIsTopElement(eventEl, true, 'Should find event visible in the viewport');
            }
        );
    });

    t.it('should support scrollIntoView if target task has no date info, should scroll to row', function(t) {

        t.chain(
            function(next) {
                var view = gantt.getSchedulingView(),
                    store = gantt.taskStore,
                    viewEl = view.el;

                store.getRootNode().removeAll();

                for(var i = 0; i < 20; i++) store.getRootNode().appendChild({ Name : 'task ' + i });

                var task = store.getRootNode().lastChild;
                view.scrollEventIntoView(task);
                next()
            },

            { waitFor : 500 },

            function () {
                var lastRowCellEl = gantt.lockedGrid.el.down('.x-grid-row:last-child .x-grid-cell-inner');
                t.elementIsTopElement(lastRowCellEl, true, 'Should find event visible in the viewport');
            }
        );
    });

    t.it('should support scrollIntoView in buffered views', function(t) {
        var g = t.getGantt({
            plugins   : 'bufferedrenderer',
            columns   : [{ xtype : 'treecolumn', dataIndex : 'Name' }],
            taskStore : new Gnt.data.TaskStore({
                sortOnLoad : false,

                root : {
                    expanded : true,
                    children : t.getLargeDataset()
                }
            }),
            renderTo  : Ext.getBody()
        });
        var task;

        t.chain(
            { waitFor : 'RowsVisible' },

            function (next) {
                task = new Gnt.model.Task({ Name : 'foo', cls : 'bar' });

                g.taskStore.getRootNode().appendChild(task);
                g.getSchedulingView().scrollEventIntoView(task, false, false, next);
            },
            { waitFor : 100 },

            function() {
                var taskEl = g.el.down('.bar');
                t.elementIsTopElement(taskEl, true, 'Should find task visible in the viewport');
            }
        );
    })
})
