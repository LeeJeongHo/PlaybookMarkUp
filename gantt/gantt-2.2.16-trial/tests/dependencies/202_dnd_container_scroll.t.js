StartTest(function (t) {
    t.diag('Gantt container element should auto-scroll if go near the edges of the container');

    var getDataSet = function () {
        var dependencyStore = t.getDependencyStore({data : [] });

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            dependencyStore : dependencyStore,
            cascadeDelay    : 0,
            proxy           : {
                type   : 'memory',
                reader : {
                    type : 'json'
                }
            },

            root : {
                expanded : false,

                children : [
                    {
                        Id        : 1,
                        leaf      : true,
                        StartDate : new Date(2011, 6, 5),
                        EndDate   : new Date(2011, 6, 10)
                    },
                    {
                        Id        : 2,
                        leaf      : true,
                        StartDate : new Date(2011, 6, 1),
                        EndDate   : new Date(2011, 6, 5)
                    }
                ]
            }
        });

        return {
            taskStore       : taskStore,
            dependencyStore : dependencyStore
        }
    }

    var dataSet = getDataSet()
    var taskStore = dataSet.taskStore
    var dependencyStore = dataSet.dependencyStore

    var gantt = t.getGantt2({
        startDate       : new Date(2011, 6, 1),
        endDate         : new Date(2011, 6, 28),
        taskStore       : taskStore,
        width           : 300,
        dependencyStore : dependencyStore,
        renderTo        : Ext.getBody()
    });

    t.is(dependencyStore.getCount(), 0, 'No dependencies in store');

    var view = gantt.getSchedulingView(),
        viewRight = gantt.normalGrid.el.getRight();

    t.it('Should scroll right', function (t) {

        t.chain(
            { waitFor : 'rowsVisible', args : gantt },

            { action : 'moveCursorTo', target : '.sch-gantt-task-bar' },
            { action : 'moveCursorTo', target : '.sch-gantt-task-bar .sch-gantt-terminal-start' },

            // that will trigger scrolling (bug in ExtJS)
            { 
                waitFor     : 'scrollLeftChange', args : view.el,
                trigger     : { action : 'drag', to : [ viewRight - 5, view.el.getTop() + 34 ], dragOnly : true }
            },

            { action : 'mouseUp' },

            function (next) {

                gantt.destroy()
            }
        );
    });

    t.it('Should scroll left, and task drag drop setting should not affect', function (t) {

        var dataSet = getDataSet()
        var taskStore = dataSet.taskStore
        var dependencyStore = dataSet.dependencyStore

        gantt = t.getGantt2({
            startDate          : new Date(2011, 6, 1),
            endDate            : new Date(2011, 6, 28),
            taskStore          : taskStore,
            width              : 300,
            dependencyStore    : dependencyStore,
            enableTaskDragDrop : false,
            renderTo           : Ext.getBody()
        });

        var view = gantt.getSchedulingView(),
            viewLeft = gantt.normalGrid.el.getLeft();

        t.chain(
            { waitFor : 'rowsVisible', args : gantt },

            function (next) {
                t.scrollHorizontallyTo(gantt.normalGrid.getView().el, 50, next)
            },

            { action : 'moveCursorTo', target : '.sch-gantt-task-bar' },
            { action : 'moveCursorTo', target : '.sch-gantt-task-bar .sch-gantt-terminal-start' },

            { 
                waitFor     : 'scrollLeftChange', args : view.el,
                trigger     : { action : 'drag', to : [ viewLeft + 5, view.el.getTop() + 34 ], dragOnly : true }
            },

            { action : 'mouseUp' }
        )
    })
})
