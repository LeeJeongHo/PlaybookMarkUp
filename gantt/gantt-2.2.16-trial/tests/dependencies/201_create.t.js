StartTest(function (t) {
    t.diag('Creating a new dependency using drag drop');

    var getDataSet = function () {
        var dependencyStore = t.getDependencyStore({data : [] });

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            cascadeDelay    : 0,

            root : {
                expanded : false,

                children : [
                    {
                        Id        : 1,
                        leaf      : true,
                        Name      : 'Foo',
                        StartDate : new Date(2011, 6, 1),
                        EndDate   : new Date(2011, 6, 5)
                    },
                    {
                        Id        : 2,
                        leaf      : true,
                        Name      : 'Bar',
                        StartDate : new Date(2011, 6, 5),
                        EndDate   : new Date(2011, 6, 20)
                    }
                ]
            }
        });

        return {
            taskStore       : taskStore,
            dependencyStore : dependencyStore
        }
    }

    t.it('Should be possible to setup a dependency between two regular tasks using drag drop', function (t) {
        var dataSet = getDataSet()
        var taskStore = dataSet.taskStore
        var dependencyStore = dataSet.dependencyStore
        var gantt = t.getGantt2({
            height          : 200,
            startDate       : new Date(2011, 6, 1),
            endDate         : new Date(2011, 6, 28),
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            renderTo        : Ext.getBody()
        });

        t.chain(
            { waitFor : 'rowsVisible' },

            { action : 'moveCursorTo', target : '.sch-gantt-item' },

            { action : 'moveCursorTo', target : '.sch-gantt-item .sch-gantt-terminal-start' },

            { action : 'mouseDown' },

            { action : 'moveCursorTo', target : '.sch-ganttview tr:last-child .sch-gantt-item' },

            { action : 'moveCursorTo', target : '.sch-ganttview tr:last-child .sch-gantt-terminal-start' },

            function(next) {
                t.selectorExists('.sch-gantt-connector-proxy', 'Should find sch-gantt-connector-proxy class during drag drop');
                t.selectorExists('.sch-gantt-dep-dd-dragging', 'Should find sch-gantt-dep-dd-dragging class added to the view container el');
                t.selectorExists('.sch-ganttview tr:last-child .sch-gantt-terminal-start.sch-gantt-terminal-drophover', 'Should find sch-gantt-terminal-drophover class added to the target connector el');

                // Lowercase to please IE8 which uses uppercase tag names
                var ddProxyContent = Ext.getBody().down('.sch-dd-dependency').dom.innerHTML.toLowerCase();

                t.like(ddProxyContent, 'from: <strong>foo</strong> - start', 'Should find proper From text');
                t.like(ddProxyContent, 'to: <strong>bar</strong> - start', 'Should find proper To text');
                next();
            },

            { action : 'mouseUp' },

            { waitFor : 1000 },

            function(next) {
                t.selectorNotExists('.sch-gantt-connector-proxy', 'Should not find sch-gantt-connector-proxy after drop');
                t.selectorNotExists('.sch-gantt-dep-dd-dragging', 'Should not find sch-gantt-dep-dd-dragging class after drop');
                next();
            },

            function (next) {
                var depView = gantt.getSchedulingView().getDependencyView();
                var els = depView.getDependencyElements();
                t.is(dependencyStore.getCount(), 1, '1 dependency in store');
                t.isGreater(els.getCount(), 0, '1 dependency rendered');

                var depRecord = dependencyStore.first();
                var els = depView.getElementsForDependency(depRecord);

                // At least one arrow element + the lines, so always 2 or more
                t.isGreater(els.getCount(), 1, 'Found rendered dependency elements');

                // Verify dependency els are 'below' task elements
                var firstTaskEl = t.getFirstTaskEl(gantt);

                // Move dependency element on top of task
                els.first().setXY(firstTaskEl.getXY());
                t.elementIsNotTopElement(els.first(), true, 'Task found on top of dependency el');

                gantt.destroy();
            }
        )
    })

    t.it('Should be possible to setup a dependency between two milestone tasks using drag drop', function (t) {
        var dataSet = getDataSet()
        var taskStore = dataSet.taskStore
        var dependencyStore = dataSet.dependencyStore
        var gantt = t.getGantt2({
            startDate       : new Date(2011, 6, 1),
            endDate         : new Date(2011, 6, 28),
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            renderTo        : Ext.getBody()
        });

        taskStore.getById(1).setStartEndDate(new Date(2011, 6, 1), new Date(2011, 6, 1));
        taskStore.getById(2).setStartEndDate(new Date(2011, 6, 1), new Date(2011, 6, 1));

        t.chain(
            { waitFor : 'rowsVisible' },

            { action : 'moveCursorTo', target : '.sch-gantt-item' },

            { action : 'moveCursorTo', target : '.sch-gantt-item .sch-gantt-terminal-start' },

            { action : 'mouseDown' },

            { action : 'moveCursorTo', target : '.sch-ganttview tr:last-child .sch-gantt-item' },

            { action : 'moveCursorTo', target : '.sch-ganttview tr:last-child .sch-gantt-terminal-start' },

            function(next) {
                t.selectorExists('.sch-gantt-connector-proxy', 'Should find sch-gantt-connector-proxy class during drag drop');
                t.selectorExists('.sch-gantt-dep-dd-dragging', 'Should find sch-gantt-dep-dd-dragging class added to the view container el');
                t.selectorExists('.sch-ganttview tr:last-child .sch-gantt-terminal-start.sch-gantt-terminal-drophover', 'Should find sch-gantt-terminal-drophover class added to the target connector el');

                // Lowercase to please IE8 which uses uppercase tag names
                var ddProxyContent = Ext.getBody().down('.sch-dd-dependency').dom.innerHTML.toLowerCase();

                t.like(ddProxyContent, 'from: <strong>foo</strong> - start', 'Should find proper From text');
                t.like(ddProxyContent, 'to: <strong>bar</strong> - start', 'Should find proper To text');
                next();
            },

            { action : 'mouseUp' },

            { waitFor : 1000 },

            function(next) {
                t.selectorNotExists('.sch-gantt-connector-proxy', 'Should not find sch-gantt-connector-proxy after drop');
                t.selectorNotExists('.sch-gantt-dep-dd-dragging', 'Should not find sch-gantt-dep-dd-dragging class after drop');
                next();
            },

            function (next) {
                var depView = gantt.getSchedulingView().getDependencyView();
                var els = depView.getDependencyElements();
                t.is(dependencyStore.getCount(), 1, '1 dependency in store');
                t.isGreater(els.getCount(), 0, '1 dependency rendered');

                var depRecord = dependencyStore.first();
                var els = depView.getElementsForDependency(depRecord);

                // At least one arrow element + the lines, so always 2 or more
                t.isGreater(els.getCount(), 1, 'Found rendered dependency elements');

                // Verify dependency els are 'below' task elements
                var firstTaskEl = t.getFirstTaskEl(gantt);

                // Move dependency element on top of task
                els.first().setXY(firstTaskEl.getXY());
                t.elementIsNotTopElement(els.first(), true, 'Task found on top of dependency el');

                gantt.destroy();
            }
        )
    })

    t.it('Should be possible to prevent certain types of dependencies', function (t) {
        Ext.define('Sch.depStore', {
            extend              : 'Gnt.data.DependencyStore',
            isValidDependency   : function(from, to, type) {
                t.is(type, Gnt.model.Dependency.Type.StartToStart, 'isValidDependency called with type property');

                return type !== Gnt.model.Dependency.Type.StartToStart &&
                       this.callParent(arguments);
            }
        })
        var dataSet = getDataSet()
        var taskStore = dataSet.taskStore
        var dependencyStore = new Sch.depStore();

        t.wontFire(dependencyStore, 'add');

        var gantt = t.getGantt2({
            startDate       : new Date(2011, 6, 1),
            endDate         : new Date(2011, 6, 28),
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            renderTo        : Ext.getBody()
        });

        t.chain(
            { waitFor : 'rowsVisible' },

            { action : 'moveCursorTo', target : '.sch-gantt-item' },

            { action : 'moveCursorTo', target : '.sch-gantt-item .sch-gantt-terminal-start' },

            { action : 'mouseDown' },

            { action : 'moveCursorTo', target : '.sch-ganttview tr:last-child .sch-gantt-item' },

            { action : 'moveCursorTo', target : '.sch-ganttview tr:last-child .sch-gantt-terminal-start' },

            function(next) {
                t.selectorExists('.sch-gantt-connector-proxy', 'Should find sch-gantt-connector-proxy class during drag drop');
                t.selectorExists('.sch-gantt-dep-dd-dragging', 'Should find sch-gantt-dep-dd-dragging class added to the view container el');
                t.selectorExists('.sch-ganttview tr:last-child .sch-gantt-terminal-start.sch-gantt-terminal-drophover', 'Should find sch-gantt-terminal-drophover class added to the target connector el');

                // Lowercase to please IE8 which uses uppercase tag names
                var ddProxyContent = Ext.getBody().down('.sch-dd-dependency').dom.innerHTML.toLowerCase();

                t.like(ddProxyContent, 'from: <strong>foo</strong> - start', 'Should find proper From text');
                t.like(ddProxyContent, 'to: <strong>bar</strong> - start', 'Should find proper To text');
                next();
            },

            { action : 'mouseUp' },

            { waitFor : 1000 },

            function(next) {
                t.selectorNotExists('.sch-gantt-connector-proxy', 'Should not find sch-gantt-connector-proxy after drop');
                t.selectorNotExists('.sch-gantt-dep-dd-dragging', 'Should not find sch-gantt-dep-dd-dragging class after drop');
                next();
            },

            function (next) {
                t.is(dependencyStore.getCount(), 0, 'No dependencies in store');
                gantt.destroy()
            }
        )
    })

    t.it('Should see the dependency proxy connector line after a view refresh too', function (t) {
        var dataSet = getDataSet()
        var taskStore = dataSet.taskStore
        var dependencyStore = new Gnt.data.DependencyStore();

        var gantt = t.getGantt2({
            startDate       : new Date(2011, 6, 1),
            endDate         : new Date(2011, 6, 28),
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            renderTo        : Ext.getBody()
        });

        t.chain(
            { waitFor : 'rowsVisible' },

            { action : 'moveCursorTo', target : '.sch-gantt-item' },

            { action : 'moveCursorTo', target : '.sch-gantt-item .sch-gantt-terminal-start' },

            { action : 'mouseDown' },

            { action : 'moveCursorTo', target : '.sch-ganttview tr:last-child .sch-gantt-item' },

            { action : 'moveCursorTo', target : '.sch-ganttview tr:last-child .sch-gantt-terminal-start' },

            function(next) {
                t.selectorExists('.sch-gantt-connector-proxy', 'Should find sch-gantt-connector-proxy class during drag drop');
                t.selectorExists('.sch-gantt-dep-dd-dragging', 'Should find sch-gantt-dep-dd-dragging class added to the view container el');
                t.selectorExists('.sch-ganttview tr:last-child .sch-gantt-terminal-start.sch-gantt-terminal-drophover', 'Should find sch-gantt-terminal-drophover class added to the target connector el');

                // Lowercase to please IE8 which uses uppercase tag names
                var ddProxyContent = Ext.getBody().down('.sch-dd-dependency').dom.innerHTML.toLowerCase();

                t.like(ddProxyContent, 'from: <strong>foo</strong> - start', 'Should find proper From text');
                t.like(ddProxyContent, 'to: <strong>bar</strong> - start', 'Should find proper To text');
                next();
            },

            { action : 'mouseUp' },

            { waitFor : 1000 },

            function(next) {
                t.selectorNotExists('.sch-gantt-connector-proxy', 'Should not find sch-gantt-connector-proxy after drop');
                t.selectorNotExists('.sch-gantt-dep-dd-dragging', 'Should not find sch-gantt-dep-dd-dragging class after drop');
                next();
            },

            function (next) {
                gantt.getView().refresh();
                next()
            },

            { action : 'moveCursorTo', target : '.sch-gantt-item' },

            { action : 'moveCursorTo', target : '.sch-gantt-item .sch-gantt-terminal-start' },

            { action : 'mouseDown' },

            { action : 'moveCursorTo', target : '.sch-ganttview tr:last-child .sch-gantt-item' },

            function(next) {
                t.selectorExists('.sch-gantt-connector-proxy', 'Should find sch-gantt-connector-proxy class during drag drop');
                t.selectorExists('.sch-gantt-dep-dd-dragging', 'Should find sch-gantt-dep-dd-dragging class added to the view container el');
            }
        )
    })
})
