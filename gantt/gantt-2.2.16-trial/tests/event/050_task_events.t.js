StartTest(function(t) {
    if (!document.elementFromPoint) {
        t.diag('Not executed')
        
        return;
    }

    t.diag('Setup')

    var taskStore = t.getTaskStore({
        autoLoad: false,
        proxy : { type : 'memory' },
        root : {
            "Id": 0,
            loaded : true,
            leaf : false,
            "expanded": true
        }
    });

    taskStore.getRootNode().appendChild(Ext.create(taskStore.model, {
        "EndDate": Ext.Date.parse("2010-01-19", 'Y-m-d'),
        "Id": 11,
        "leaf": true,
        "Name": "Investigate",
        "ParentId": 1,
        "PercentDone": 30,
        "Priority": 1,
        "Responsible": "",
        "StartDate": Ext.Date.parse("2010-01-17", 'Y-m-d')
    }));

    taskStore.getRootNode().appendChild(Ext.create(taskStore.model, {
        "EndDate": Ext.Date.parse("2010-01-19", 'Y-m-d'),
        "Id": 21,
        "leaf": true,
        "Name": "Investigate",
        "ParentId": 1,
        "PercentDone": 30,
        "Priority": 1,
        "Responsible": "",
        "StartDate": Ext.Date.parse("2010-01-17", 'Y-m-d')
    }));

    var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        autoLoad: false,
        data : [
           {
              "From":11,
              "To":21,
              "Type":2
           }
        ]
    });

    var g = Ext.create('Gnt.panel.Gantt', {
        height: 350,
        width: 1000,
        renderTo: Ext.getBody(),
        startDate: new Date(2010, 0, 4),
        endDate: Sch.util.Date.add(new Date(2010, 0, 4), Sch.util.Date.WEEK, 10),
        viewPreset: 'weekAndDayLetter',
        rootVisible : true,
        // Setup your static columns
        columns: [
            {
                xtype : 'treecolumn',
                header: 'Tasks',
                sortable: true,
                dataIndex: 'Name',
                width: 200,
                field: {
                    allowBlank: false
                }
            }
        ],

        taskStore: taskStore,
        dependencyStore: dependencyStore
    });
    
    
    function verifyTaskEventSignature() { 
        return arguments && 
                arguments[0] instanceof Gnt.view.Gantt &&
                arguments[1] instanceof Gnt.model.Task && 
                !!arguments[2].getTarget;
    }

    function verifyDependencyEventSignature() { 
        return arguments && 
                arguments[0] instanceof Gnt.view.Dependency &&
                arguments[1] instanceof Gnt.model.Dependency && 
                !!arguments[2].getTarget;
                arguments[2] instanceof HTMLElement;
    }

    g.on({
        'taskclick' : verifyTaskEventSignature,
        'taskdblclick' : verifyTaskEventSignature,
        'taskcontextmenu' : verifyTaskEventSignature,
        'dependencydblclick' : verifyDependencyEventSignature
    });

    Ext.each(['taskclick', 'taskdblclick', 'taskcontextmenu', 'dependencydblclick'], function(o) {
        t.willFireNTimes(g, o, 1);
    });
    
    t.waitForTasksAndDependenciesToRender(g, function() {
        var firstTask = taskStore.getRootNode().childNodes[0];
        var taskEl = g.getSchedulingView().getElementFromEventRecord(firstTask);
    
        t.simulateEvent(taskEl, "click");
        t.simulateEvent(taskEl, "contextmenu");
        t.simulateEvent(taskEl, "dblclick");
    
        var els = g.getSchedulingView().dependencyView.getElementsForDependency(dependencyStore.first());
        t.simulateEvent(els.first(), "dblclick");

        
    });
})    
