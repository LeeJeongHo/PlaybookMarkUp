StartTest(function (t) {

    t.it('Should be able to use all actions of the menu',  function(t) {
        var menu = Ext.create('Gnt.plugin.TaskContextMenu', {
            triggerEvent : 'taskcontextmenu'
        });

        var g = t.getGantt({
            lockedGridConfig    : { width : 150 },
            viewPreset : 'weekAndDayLetter',
            renderTo   : Ext.getBody(),
            forceFit   : true,
            plugins    : menu
        });

        t.chain(
            { waitFor : 'tasksAndDependenciesToRender' },
            { rightClick : t.getFirstTaskEl(g) },
            { waitFor : 'ComponentVisible', args : menu },

            function (next) {
                var store = g.taskStore,
                    root = store.getRootNode();

                var firstTask = g.resolveTaskRecord(t.getFirstTaskEl(g));

                t.pass('Context menu shown after task bar contextmenu click');
                menu.addTaskAboveAction();
                t.is(g.getSchedulingView().el.select('.x-grid-row-selected').getCount(), 1, '1 row selected (bug #123)');

                menu.addMilestone();
                var newTask = firstTask.nextSibling;
                t.ok(newTask.isMilestone(), 'Milestone added');

                t.isStartEnd(newTask, firstTask.getEndDate(), firstTask.getEndDate(), 'Correct dates for milestone');

                menu.toggleMilestone();
                t.ok(firstTask.isMilestone(), 'Converted to milestone');
                t.is(firstTask.getDuration(), 0, 'Correct duration for milestone');

                menu.toggleMilestone();
                t.notOk(firstTask.isMilestone(), 'Converted to regular task');
                t.is(firstTask.getDuration(), 1, 'Correct duration for milestone');


                menu.addTaskBelowAction();
                menu.addSubtask();
                menu.addSuccessor();
                menu.addPredecessor();
                menu.editLeftLabel();
                menu.editRightLabel();
                menu.deleteTask();
                menu.hide();

                root.removeAll();

                menu.hide();
                t.ok(!menu.isVisible(), 'Context menu hidden');

                next();
            },
            // wait for 100ms here to zones to dissapear, otherwise we can click on the timespan zone by accident
            // (since all tasks were removed from store they will be reachable)
            'waitFor(100)',
            { rightClick : g.getSchedulingView().el },

            function () {
                t.ok(menu.isVisible(), 'Context menu shown after contextmenu click on empty gantt body');
                menu.addTaskAboveAction();
                g.destroy();
                t.notOk(menu.el, 'Menu element destroyed');
            }
        )
    });

    t.it('Should function correctly when no tasks exist',  function(t) {
        var menu2 = Ext.create('Gnt.plugin.TaskContextMenu', {
            triggerEvent : 'itemcontextmenu'
        });

        var g2 = t.getGantt({
            viewPreset      : 'weekAndDayLetter',
            renderTo : Ext.getBody(),
            viewConfig : { forceFit : true },
            startDate : new Date(1980, 1, 1),
            endDate : new Date(1980, 6, 1),
            forceFit : true,
            plugins : menu2
        });

        t.chain(
            { waitFor : 'RowsVisible', args : g2 },
            { rightClick : t.getFirstScheduleRowEl(g2) },
            { waitFor : 'ComponentVisible', args : menu2 },

            function (next) {
                var store = g2.taskStore,
                    root = store.getRootNode();

                t.pass('Context menu shown after row contextmenu click');
                menu2.hide();

                root.removeAll();
                next();
            },

            { click : null },

            function(next) {
                t.ok(!menu2.isVisible(), 'Context menu hidden');
                next();
            },

            { rightClick : null } ,

            function(next) {
                t.ok(menu2.isVisible(), 'Context menu shown after contextmenu click on empty gantt body');

                menu2.hide();
                next();
            },

            { rightClick : g2.lockedGrid.getView().el },

            function(next) {
                t.ok(menu2.isVisible(), 'Context menu shown after contextmenu click on empty locked grid body');
            }
        )
    })
});
