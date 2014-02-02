StartTest(function(t) {
    var taskEditor = new Gnt.plugin.TaskEditor();

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        resourceStore : t.getResourceStore(),
        forceFit    : true,
        lockedGridConfig : { collapsed : true},
        plugins     : taskEditor
    });

    var taskStore = g.getTaskStore();
    var task = taskStore.getById(117);

    var newTask = new Gnt.model.Task({
        Name            : 'Phantom task',
        PercentDone     : 30,
        StartDate       : new Date(2010, 1, 1),
        EndDate         : new Date(2010, 1, 7),
        leaf            : true
    });

    task.addTaskAbove(newTask);

    var startDateField;
    var durationField;

    t.chain(
        { waitFor : 'tasksAndDependenciesToRender', args : g },

        function (next) {
            t.doubleClick(g.getSchedulingView().getElementFromEventRecord(task), next);
        },

        { waitFor : 'componentVisible', args : taskEditor },

        function(next, win) {
            startDateField  = Ext.ComponentQuery.query('[$className=Gnt.field.StartDate]', win)[0];
            durationField   = Ext.ComponentQuery.query('[$className=Gnt.field.Duration]', win)[0];

            t.diag('Change start date & duration');

            startDateField.setVisibleValue(new Date(2010, 1, 1));
            durationField.setValue({ value : 7, unit : 'd' });

            taskEditor.completeEditing();

            t.is(task.getStartDate(), new Date(2010, 1, 1), 'Start date changed');
            t.is(task.getDuration(), 7, 'Duration changed');
            t.is(task.getDurationUnit(), 'd', 'Duration unit is right');

            next();
        },

        function (next) {
            t.diag('Edit phantom task');
            t.doubleClick(g.getSchedulingView().getElementFromEventRecord(newTask), next);
        },

        { waitFor : 'componentVisible', args : taskEditor },

        function(next, win) {
            var percentField   = Ext.ComponentQuery.query('[$className=Gnt.field.Percent]', win)[0];
            var endDateField  = Ext.ComponentQuery.query('[$className=Gnt.field.EndDate]', win)[0];

            t.is(startDateField.getVisibleValue(), new Date(2010, 1, 1), 'Correct start date');
            t.is(endDateField.getVisibleValue(), new Date(2010, 1, 6), 'Correct end date');
            t.is(percentField.getValue(), 30, 'Correct percent completion value');

            t.diag('Change start date & duration');

            startDateField.setVisibleValue(new Date(2010, 1, 3));
            durationField.setValue({ value : 7, unit : 'd' });

            next(win);
        },

        function (next) {
            var assignmentGrid   = Ext.ComponentQuery.query('[$className=Gnt.widget.AssignmentEditGrid]')[0];

            t.is(assignmentGrid.taskId, newTask.getPhantomId(), 'Assignment grid got phantom task id');

            taskEditor.completeEditing();

            t.is(newTask.getStartDate(), new Date(2010, 1, 3), 'Start date changed');
            t.is(newTask.getDuration(), 7, 'Duration changed');
            t.is(newTask.getDurationUnit(), 'd', 'Duration unit is right');
        }
    );


});
