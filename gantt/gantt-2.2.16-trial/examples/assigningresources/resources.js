//Ext.Loader.setConfig({enabled: true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../../ExtScheduler2.x/js/Sch');
//Ext.Loader.setPath('Gnt', '../../js/Gnt');

Ext.require([
    'Gnt.panel.Gantt',
    'Sch.plugin.TreeCellEditing',
    'Gnt.column.PercentDone',
    'Gnt.column.StartDate',
    'Gnt.column.EndDate',
    'Gnt.column.ResourceAssignment',
    'Gnt.model.Assignment'
]);

Ext.onReady(function() {
    
    var resourceStore = Ext.create("Gnt.data.ResourceStore", {
        model : 'Gnt.model.Resource'
    });

    var assignmentStore = Ext.create("Gnt.data.AssignmentStore", {
        autoLoad    : true,
        
//        autoSync : true, // uncomment for sending updates automatically to server  
        
        // Must pass a reference to resource store
        resourceStore : resourceStore,
        proxy : {
            method: 'GET',
            type : 'ajax',
            api: {
                read : 'assignmentdata.js'
//                uncomment and provide your urls to hook with server-side
//                ,
//                create : 'create.php',
//                update : 'update.php',
//                destroy : 'delete.php'
            },
            reader : {
                type : 'json',
                root : 'assignments'
            }
        },
        listeners : {
            load : function() {
                resourceStore.loadData(this.proxy.reader.jsonData.resources);
            }
        }
    });

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        proxy : {
            type : 'ajax',
            method: 'GET',
            url: 'taskdata.js',
            reader : {
                type : 'json'
            }
        }
    });

    var cellEditing = Ext.create('Sch.plugin.TreeCellEditing', {
        clicksToEdit: 1
    });

    var g = Ext.create('Gnt.panel.Gantt', {
        height : ExampleDefaults.height,
        width : ExampleDefaults.width,
        renderTo : 'example-container',
        multiSelect : true,

        // Object with editor and dataIndex defined
        leftLabelField : {
            dataIndex : 'Name',
            editor : { xtype : 'textfield' }
        },

        // ... or an object with editor and renderer defined
        rightLabelField : {
            dataIndex : 'Id',
            renderer : function(value, record) {
                return 'Id: #' + value;
            }
        },

        eventRenderer : function(task) {
            if (assignmentStore.findExact('TaskId', task.data.Id) >= 0) {
                // This task has resources assigned, show a little icon
                return {
                    ctcls : 'resources-assigned'
                };
            }
        },

        highlightWeekends : true,
        showTodayLine : true,
        loadMask : true,
        enableDependencyDragDrop : false,
        snapToIncrement : true,
        plugins: cellEditing,

        startDate : new Date(2010,0,11), 
        endDate : Sch.util.Date.add(new Date(2010,0,11), Sch.util.Date.WEEK, 20), 
        viewPreset : 'weekAndDayLetter',
            
        // Setup your static columns
        columns : [
            {
                xtype       : 'namecolumn',
                width       : 250
            },
            {
                xtype   : 'resourceassignmentcolumn',
                header  : 'Assigned Resources',
                width   : 150
            }
        ],
        tbar : [
            {
                text : 'Indent',
                iconCls : 'indent',
                handler : function() {
                    var sm = g.lockedGrid.getSelectionModel();
                    g.taskStore.indent(sm.getSelection());
                }
            },
            {
                text : 'Outdent',
                iconCls : 'outdent',
                handler : function() {
                    var sm = g.lockedGrid.getSelectionModel();
                    g.taskStore.outdent(sm.getSelection());
                }
            }
        ],
        resourceStore : resourceStore,
        assignmentStore : assignmentStore,
        taskStore : taskStore,
        stripeRows : true
    });
});
