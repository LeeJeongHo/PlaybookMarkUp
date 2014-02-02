StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setup')
    t.expectGlobal('TaskModelWithBaseline');
    Ext.define("TaskModelWithBaseline", {
        extend : "Gnt.model.Task",
            
        // Some additional fields for baseline calculation
        fields : [
            {name : 'BaselineStartDate', type : 'date', dateFormat : 'Y-m-d' },
            {name : 'BaselineEndDate', type : 'date', dateFormat : 'Y-m-d' },
            {name : 'BaselinePercentDone'}
        ]
    });

    var start   = new Date(2010, 0, 1),
        end     = Sch.util.Date.add(start, Sch.util.Date.MONTH, 10);
       
    var taskStore = Ext.create("Gnt.data.TaskStore", {
        model       : 'TaskModelWithBaseline',
        
        proxy       : {
            type: 'memory',
            reader: {
                type: 'json'
            },
            data : [
                { 
			        "EndDate" : "2010-01-16",
			        "BaselineEndDate" : "2010-01-16",
			        "Id" : 11,
                    "leaf" : true,
			        "Name" : "Investigate",
			        "ParentId" : 1,
			        "PercentDone" : 30,
                    "BaselinePercentDone" : 10,
			        "Priority" : 1,
			        "Responsible" : "",
			        "StartDate" : "2010-01-04",
			        "BaselineStartDate" : "2010-01-04"
		        },
                { 
			        "EndDate" : "2010-01-18",
			        "BaselineEndDate" : "2010-01-18",
			        "Id" : 21,
                    "leaf" : false,
			        "Name" : "Investigate",
			        "ParentId" : 1,
			        "PercentDone" : 30,
                    "BaselinePercentDone" : 10,
			        "Priority" : 1,
			        "Responsible" : "",
			        "StartDate" : "2010-01-04",
			        "BaselineStartDate" : "2010-01-04"
		        }
            ]
        },
        root: {
            loaded: true,
            expanded: true
        }
    });
    taskStore.load();

    var gantt = t.getGantt2({
        startDate : new Date(2010, 0, 4),
        endDate : new Date(2010, 1, 15),
        renderTo : Ext.getBody(),
        baselineVisible : true,
        taskStore : taskStore   
    });

    t.waitForEventsToRender(gantt, function () {
        //----------------------------
        t.diag('Testing leaf task');

        var ganttView   = gantt.getSchedulingView();
        
        t.is(ganttView.el.select('.sch-gantt-task-baseline').getCount(), 1, 'Leaf task baseline elements rendered');
        
        var normalRegion = ganttView.el.down('.sch-gantt-task .sch-gantt-task-bar').getRegion(),
            baselineRegion = ganttView.el.down('.sch-gantt-task-baseline .sch-gantt-task-bar').getRegion();
        
        t.is(normalRegion.left, baselineRegion.left, 'Leaf: Correct left value');
        t.is(normalRegion.right, baselineRegion.right, 'Leaf: Correct right value');
        
        t.isLE(normalRegion.bottom, baselineRegion.top, 'Leaf: baseline is positioned below normal task');

        t.is(normalRegion.bottom-normalRegion.top, 
             baselineRegion.bottom - baselineRegion.top, 
             'Equal height of normal and baseline elements');
        
        //----------------------------
        t.diag('Testing parent task');

        var parentRegion = ganttView.el.down('.sch-gantt-parent-task .sch-gantt-item').getRegion(),
            baselineParentRegion = ganttView.el.down('.sch-gantt-parenttask-baseline .sch-gantt-item').getRegion(),
            offset = ganttView.getXOffset(taskStore.getNodeById(21));
        
        t.is(parentRegion.left + offset, baselineParentRegion.left, 'Parent: Correct left value');
        t.is(parentRegion.right - offset, baselineParentRegion.right, 'Parent: Correct right value');
        
        t.isLE(parentRegion.bottom, baselineParentRegion.top, 'Parent: baseline is positioned below normal task');
        
        t.is(normalRegion.bottom - normalRegion.top, 
             baselineRegion.bottom - baselineRegion.top, 
             'Parent: Equal height of normal and baseline elements');

        taskStore.getNodeById(21).remove();

        //----------------------------
        t.diag('Testing partial visibility');

        // Render task partially, starting outside
        taskStore.getById(11).setStartDate(new Date(2009, 11, 28));
        taskStore.getById(11).setBaselineStartDate(new Date(2009, 11, 28));
        taskStore.getById(11).setBaselineEndDate(taskStore.getById(11).getEndDate());
        t.is(ganttView.el.select('.sch-event-startsoutside').getCount(), 2, 'sch-event-startsoutside CSS class found');
        
        t.selectorExists('.sch-gantt-task-baseline', 'Leaf task baseline elements rendered, when starting before');
        
        t.is(ganttView.el.down('.sch-gantt-task-baseline').getWidth(), 
             ganttView.el.down('.sch-gantt-task').getWidth(), 
             'Correct width when ending after');

        // Render task partially, ending outside
        taskStore.getById(11).setStartDate(new Date(2010, 1, 8));
        taskStore.getById(11).setBaselineStartDate(new Date(2010, 1, 8));
        taskStore.getById(11).setBaselineEndDate(taskStore.getById(11).getEndDate());
        t.is(ganttView.el.select('.sch-gantt-task-baseline').getCount(), 1, 'Leaf task baseline elements rendered, when ending after');
        t.is(ganttView.el.select('.sch-event-endsoutside').getCount(), 2, 'sch-event-endsoutside CSS class found');
        t.is(ganttView.el.down('.sch-gantt-task-baseline').getWidth(), ganttView.el.down('.sch-gantt-task').getWidth(), 'Correct width when ending after');
        
        // Render task after view end
        taskStore.getById(11).setStartDate(new Date(2012, 1, 8));
        taskStore.getById(11).setBaselineStartDate(new Date(2012, 1, 8));
        taskStore.getById(11).setBaselineEndDate(taskStore.getById(11).getEndDate());
        t.selectorNotExists('.sch-gantt-item', 'No task elements, when after timeaxis');

        // Render task before view start
        taskStore.getById(11).setStartDate(new Date(2008, 1, 8));
        taskStore.getById(11).setBaselineStartDate(new Date(2008, 1, 8));
        taskStore.getById(11).setBaselineEndDate(taskStore.getById(11).getEndDate());
        t.selectorNotExists('.sch-gantt-item', 'No task elements, when before timeaxis');


        // Now no baseline elements should be seen
        gantt.setTimeSpan(new Date(2002, 0, 1));
        t.selectorNotExists('.sch-event-wrap', 'No elements found when baseline dates do not intersect viewed dates')
    })
})    
