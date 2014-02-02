Ext.ns('App');


Ext.Loader.setConfig({ 
    enabled: true, 
    disableCaching : true,
    paths : {
        'MyApp' : './js'
    }
});

Ext.require([
    'MyApp.DemoGanttPanel',
    'Gnt.column.StartDate',
    'Gnt.column.EndDate',
    'Gnt.column.Duration',
    'Gnt.column.PercentDone',
    'Gnt.column.ResourceAssignment'    
]);


Ext.onReady(function() {
    Ext.QuickTips.init();

    Ext.define('MyTaskModel', {
        extend : 'Gnt.model.Task',

        clsField : 'TaskType',
        fields : [
            { name : 'TaskType', type : 'string' },
            { name : 'leaf', type: 'bool'}
        ]
    });

    Ext.define('MyTaskStore', {
        extend: 'Gnt.data.TaskStore',
        autoload: true,
        autoSync: true,
        model: 'MyTaskModel'
    });

    var taskStore = Ext.create('MyTaskStore', {
        sorters : {
            property : 'Id',
            direction : 'ASC'
        },
        proxy : {
            type : 'ajax',
            method: 'POST',
            reader: {
                type : 'json'
            }, 
            api: {
                read: 't-read.php',
                create: 't-create.php',
                destroy: 't-destroy.php',
                update: 't-update.php'
            },
            writer : {
                type : 'json',
                root: 'data',
                encode: true,
                writeAllFields: true,
                listful : true,
                allowSingle: false              
            }
        }
    });

    var resourceStore = Ext.create("Gnt.data.ResourceStore", {
        model : 'Gnt.model.Resource',
        autoLoad: true,
        proxy : {
            method: 'POST',
            type : 'ajax',
            api: {
                read : 'r-read.php',
                create: 'r-create.php',
                destroy: 'r-destroy.php',
                update: 'r-update.php'                    
            },
            reader : {
                type : 'json'
            },
            writer : {
                type : 'json',
                root: 'data',
                encode: true,
                writeAllFields: true,
                listful : true,
                allowSingle: false              
            }                
        }
    });

    var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        autoLoad: true,
        autoSync: true,
        proxy: {
            type : 'ajax',
            method: 'POST',
            api: {
                read: 'd-read.php',
                create: 'd-create.php',
                destroy: 'd-destroy.php',
                update: 'd-update.php'
            },
            reader: {
                type : 'json'
            },                
            writer : {
              type : 'json',
              root: 'data',
              encode: true,
              writeAllFields: true,
              allowSingle: false                
            }
        }
    });

    var assignmentStore = Ext.create("Gnt.data.AssignmentStore", {
        model: 'Gnt.model.Assignment',
        autoLoad: true,
        autoSync: true,
        resourceStore: resourceStore,
        proxy : {
            method: 'POST',
            type : 'ajax',
            api: {
                read : 'a-read.php',
                create: 'a-create.php',
                destroy: 'a-destroy.php',
                update: 'a-update.php'                    
            },
            reader : {
                type : 'json'
            },
            writer : {
                type : 'json',
                root: 'data',
                encode: true,
                writeAllFields: true,
                listful : true,
                //thanks to this, we're always getting array on the server side
                allowSingle: false              
            }                
        }
    });        

    var startDate = new Date(2012, 8),
        endDate   = Sch.util.Date.add(startDate, Sch.util.Date.MONTH, 5);

    var g = Ext.create("MyApp.DemoGanttPanel", {
        renderTo        : Ext.getBody(),
        width           : 1200,
        height          : 600,
        selModel        : new Ext.selection.TreeModel({ ignoreRightMouseSelection : false, mode     : 'MULTI'}),
        taskStore       : taskStore,
        dependencyStore : dependencyStore,
        assignmentStore : assignmentStore,
        resourceStore   : resourceStore,
        columnLines     : true,
        startDate       : startDate,
        endDate         : endDate,
        viewPreset      : 'weekAndDayLetter',
        leftLabelField : {
            dataIndex : 'Name',
            editor : { xtype : 'textfield' }
        },
        rightLabelField : {
            dataIndex : 'Id',
            renderer : function(value, record) {
                return 'Id: #' + value;
            }
        },
        eventRenderer : function(task) {
            if (assignmentStore.findExact('TaskId', task.data.Id) >= 0) {
                return {
                    ctcls : 'resources-assigned'
                };
            }
        },
        columns : [
            {
                xtype       : 'namecolumn',
                width       : 200,
                renderer    : function(v, meta, r) {
                    if (!r.data.leaf) meta.tdCls = 'sch-gantt-parent-cell';

                    return v;
                }
            },            
            {
                xtype : 'startdatecolumn'
            },
            {
                xtype : 'enddatecolumn'
            },                
            {
                xtype : 'durationcolumn'
            },
            {
                xtype : 'percentdonecolumn',
                width : 50
            },
            {
                text    : 'Assigned Resources',
                width   :150,
                xtype   : 'resourceassignmentcolumn'
            }
        ]           
    });
});