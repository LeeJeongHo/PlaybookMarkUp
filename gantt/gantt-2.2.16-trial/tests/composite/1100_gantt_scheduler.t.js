StartTest(function (t) {
    var resourceStore   = t.getResourceStore();
    var taskStore       = t.getTaskStore();
    var assignmentStore = t.getAssignmentStore({
        resourceStore : resourceStore
    });
    var depStore        = t.getDependencyStore();
    
    var startDate       = new Date(2010, 1, 1)
    var endDate         = Sch.util.Date.add(startDate, Sch.util.Date.WEEK, 20)

    var gantt = t.getGantt({
        region              : 'center',
        highlightWeekends   : true,

        startDate           : startDate,
        endDate             : endDate,
        
        viewPreset          : 'weekAndDayLetter',
        columns             : [
            {
                xtype       : 'treecolumn',
                header      : 'Tasks',
                dataIndex   : 'Name',
                width       : 200
            },
            {
                xtype       : 'resourceassignmentcolumn',
                width       : 100
            }
        ],
        taskStore           : taskStore,
        resourceStore       : resourceStore,
        assignmentStore     : assignmentStore,
        dependencyStore     : depStore
    });

    resourceStore.first().assignTo(taskStore.getRootNode().lastChild);

    var scheduler = t.getScheduler({
        resourceStore       : resourceStore,
        eventStore          : taskStore,
        
        height              : 500,

        region              : 'south',

        columns : [
            {header : 'Name', width : 350, dataIndex : 'Name'}
        ],

        // Share time axis
        timeAxis : gantt.getTimeAxis(),

        // Share non-working time visualization
        plugins : new Sch.plugin.Zones({
            store : gantt.getWorkingTimePlugin().store
        })
    });

    var vp = new Ext.Viewport({
        items : [gantt, scheduler]
    });
    
    t.is(gantt.getStart(), startDate, 'Correct start date')
    
    t.is(scheduler.timeAxis, gantt.timeAxis, 'Timeaxis shared')
    t.is(scheduler.getStart(), gantt.getStart(), 'Same start date')
    
    gantt.timeAxis.shiftNext();
    t.is(scheduler.getStart(), gantt.getStart(), 'Same start date after shift')

    t.waitForSelector('.sch-zone', scheduler.el, function() {
        t.pass('Zones rendered ok in scheduler')
    });
    
    t.waitForSelector('.sch-event', scheduler.el, function () {
        t.pass('Events rendered ok in scheduler');

        resourceStore.first().setName('__FOO__');

        // The gantt chart should react to resource data changes
        t.matchGridCellContent(gantt.lockedGrid,
                               gantt.lockedGrid.view.store.getCount() - 1,
                               1,
                               '__FOO__',
                               'Should find updated resource name in assignment column')

        // The gantt chart should react to event data changes in the scheduler
        t.firesAtLeastNTimes(gantt.getSchedulingView(), 'itemupdate', 1);

        t.chain(
            { action : 'drag', target : '.sch-event', by : [100, 0] }
        )
    });
})
