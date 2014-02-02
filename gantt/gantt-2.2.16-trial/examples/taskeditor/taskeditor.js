//Ext.Loader.setConfig({enabled: true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../../ExtScheduler2.x/js/Sch');
//Ext.Loader.setPath('Gnt', '../../js/Gnt');

Ext.require([
    'Ext.data.Store',
    'Gnt.panel.Gantt',
    'Gnt.column.PercentDone',
    'Gnt.column.StartDate',
    'Gnt.column.EndDate',
    'Gnt.widget.taskeditor.TaskEditor',
    'Gnt.column.ResourceAssignment',
    'Gnt.model.Assignment',
    'Gnt.data.Calendar',
    'Gnt.data.calendar.BusinessTime',
    'Gnt.plugin.TaskEditor'
]);


Ext.define('Calendar', {
    extend : 'Ext.data.Model',
    idProperty : 'Id',
    fields: ['Id', 'Name']
});


Ext.onReady(function() {

    Ext.tip.QuickTipManager.init();

    // calendar store
    var calendarStore = Ext.create('Ext.data.Store', {
        model : 'Calendar'
    });

    var calendarsCount = 2;
    var onCalendarLoad = function() {
        if (--calendarsCount > 0) return;

        var result = [];
        Ext.Array.each(Gnt.data.Calendar.getAllCalendars(), function (cal) {
            result.push({
                Id      : cal.calendarId,
                Name    : cal.name || cal.calendarId
            });
        });

        calendarStore.add(result);
    };


    var rootCalendar = new Gnt.data.calendar.BusinessTime({
        calendarId      : 'General',
        name            : 'General',
        autoLoad        : true,
        proxy           : {
            type    : 'ajax',
            api     : { read : 'rootCalendarData.js' },
            reader  : { type : 'json' }
        },
        listeners       : {
            beforesync      : function() { return false; },
            load            : onCalendarLoad
        }
    });

    var holidaysCalendar    = new Gnt.data.calendar.BusinessTime({
        calendarId      : 'Holidays',
        name            : 'Holidays',
        autoLoad        : true,
        proxy           : {
            type    : 'ajax',
            api     : { read : 'holidaysCalendarData.js' },
            reader  : { type : 'json' }
        },
        listeners       : {
            beforesync      : function() { return false; },
            load            : onCalendarLoad
        }
    });

    var nightShiftCalendar = new Gnt.data.calendar.BusinessTime({
        calendarId              : 'NightShift',
        name                    : 'Night shift',
        defaultAvailability     : [ '00:00-06:00', '22:00-24:00' ]
    });



    var resourceStore = Ext.create('Gnt.data.ResourceStore', {
        model : 'Gnt.model.Resource'
    });

    var assignmentStore = Ext.create('Gnt.data.AssignmentStore', {
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


    var dependencyStore = Ext.create('Gnt.data.DependencyStore', {
        autoLoad: true,
        proxy: {
            type : 'ajax',
            url: 'dependencies.js',
            method: 'GET',
            reader: {
                type : 'json'
            }
        }
    });


    var taskStore = Ext.create('Gnt.data.TaskStore', {
        calendar    : rootCalendar,
        proxy : {
            type : 'ajax',
            method: 'GET',
            url: 'taskdata.js',
            reader : {
                type : 'json'
            }
        }
    });

    var taskEditor = Ext.create('Gnt.plugin.TaskEditor');

    var g = Ext.create('Gnt.panel.Gantt', {
        height : ExampleDefaults.height,
        //width : ExampleDefaults.width,
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
        enableBaseline  : true,
        snapToIncrement : true,

        startDate : new Date(2010,0,11),
        endDate : Sch.util.Date.add(new Date(2010,0,11), Sch.util.Date.WEEK, 20),
        viewPreset : 'weekAndDayLetter',

        // Setup your static columns
        columns : [
            {
                xtype     : 'namecolumn',
                width     : 250
            },
            {
                xtype     : 'resourceassignmentcolumn',
                width     : 150
            }
        ],
        tbar : [
            {
                text     : 'Show Editor',
                iconCls  : 'indent',
                disabled : true,
                handler  : function() {
                    var sm = g.lockedGrid.getSelectionModel();
                    if (sm.selected.length) {
                        taskEditor.showTask(sm.selected.items[0]);
                    }
                }
            }
        ],
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore,
        dependencyStore : dependencyStore,
        taskStore       : taskStore,
        // register plugin
        plugins         : taskEditor,
        stripeRows      : true,
        listeners : {
            selectionchange : function(t, sel) {
                var el;
                if (el = this.down('[iconCls=indent]')) {
                    el.setDisabled(!sel.length);
                }
            }
        }
    });
});
