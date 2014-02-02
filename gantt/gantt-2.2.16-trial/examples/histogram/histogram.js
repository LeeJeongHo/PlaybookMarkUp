//Ext.Loader.setConfig({enabled: true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../../ExtScheduler2.x/js/Sch');
//Ext.Loader.setPath('Gnt', '../../js/Gnt');

Ext.require([
    'Ext.data.Model',
    'Ext.data.Store',
    'Gnt.panel.Gantt',
    'Sch.plugin.TreeCellEditing',
    'Gnt.column.PercentDone',
    'Gnt.column.StartDate',
    'Gnt.column.EndDate',
    'Gnt.column.ResourceAssignment',
    'Gnt.model.Assignment',
    'Gnt.panel.ResourceHistogram',
    'Gnt.column.Scale',
    'Gnt.data.Calendar',
    'Gnt.data.calendar.BusinessTime'
]);

Ext.onReady(function () {

    Ext.define('Calendar', {
        extend     : 'Ext.data.Model',
        idProperty : 'Id',
        fields     : ['Id', 'Name']
    });

    // calendar store
    var calendarStore = Ext.create('Ext.data.Store', {
        model : 'Calendar'
    });

    var calendarsCount = 2;
    var onCalendarLoad = function () {
        if (--calendarsCount > 0) return;

        var result = [];
        Ext.Array.each(Gnt.data.Calendar.getAllCalendars(), function (cal) {
            result.push({
                Id   : cal.calendarId,
                Name : cal.name || cal.calendarId
            });
        });

        calendarStore.add(result);
    };

    var rootCalendar = new Gnt.data.calendar.BusinessTime({
        calendarId : 'General',
        name       : 'General',
        autoLoad   : true,
        proxy      : {
            type   : 'ajax',
            api    : { read : 'rootCalendarData.js' },
            reader : { type : 'json' }
        },
        listeners  : {
            beforesync : function () {
                return false;
            },
            load       : onCalendarLoad
        }
    });

    var holidaysCalendar = new Gnt.data.calendar.BusinessTime({
        calendarId : 'Holidays',
        name       : 'Holidays',
        autoLoad   : true,
        proxy      : {
            type   : 'ajax',
            api    : { read : 'holidaysCalendarData.js' },
            reader : { type : 'json' }
        },
        listeners  : {
            beforesync : function () {
                return false;
            },
            load       : onCalendarLoad
        }
    });

    var customizedCalendar = new Gnt.data.calendar.BusinessTime({
        calendarId : 'Customized',
        name       : 'Customized',
        autoLoad   : true,
        proxy      : {
            type   : 'ajax',
            api    : { read : 'customizedData.js' },
            reader : { type : 'json' }
        },
        listeners  : {
            beforesync : function () {
                return false;
            },
            load       : onCalendarLoad
        }
    });

    var resourceStore = Ext.create("Gnt.data.ResourceStore", {
        model : 'Gnt.model.Resource',
        proxy : {
            method : 'GET',
            type   : 'ajax',
            api    : {
                read : 'assignmentdata.js'
            },
            reader : {
                type : 'json',
                root : 'resources'
            }
        }
    });

    var assignmentStore = Ext.create("Gnt.data.AssignmentStore", {
        autoLoad      : true,
        // Must pass a reference to resource store
        resourceStore : resourceStore,
        proxy         : {
            method : 'GET',
            type   : 'ajax',
            api    : {
                read : 'assignmentdata.js'
            },
            reader : {
                type : 'json',
                root : 'assignments'
            }
        },
        listeners     : {
            load : function () {
                resourceStore.load();
            }
        }
    });

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore,
        calendar        : rootCalendar,
        proxy           : {
            type   : 'ajax',
            method : 'GET',
            url    : 'taskdata.js',
            reader : {
                type : 'json'
            }
        }
    });

    var cellEditing = Ext.create('Sch.plugin.TreeCellEditing', {
        clicksToEdit : 1
    });

    var g = Ext.create('Gnt.panel.Gantt', {
        height           : ExampleDefaults.height / 2,
        width            : ExampleDefaults.width,
        renderTo         : 'example-container',
        multiSelect      : true,
        lockedGridConfig : {
            width : 350
        },

        // Object with editor and dataIndex defined
        leftLabelField   : {
            dataIndex : 'Name',
            editor    : { xtype : 'textfield' }
        },

        // ... or an object with editor and renderer defined
        rightLabelField  : {
            dataIndex : 'Id',
            renderer  : function (value, record) {
                return 'Id: #' + value;
            }
        },

        eventRenderer : function (task) {
            if (assignmentStore.findExact('TaskId', task.data.Id) >= 0) {
                // This task has resources assigned, show a little icon
                return {
                    ctcls : 'resources-assigned'
                };
            }
        },

        highlightWeekends        : true,
        showTodayLine            : true,
        loadMask                 : true,
        enableDependencyDragDrop : false,
        snapToIncrement          : true,
        plugins                  : cellEditing,

        startDate       : new Date(2010, 0, 11),
        endDate         : Sch.util.Date.add(new Date(2010, 0, 11), Sch.util.Date.WEEK, 20),
        viewPreset      : 'weekAndDayLetter',

        // Setup your static columns
        columns         : [
            {
                xtype     : 'namecolumn',
                width     : 200
            },
            {
                text    : 'Assigned Resources',
                width   : 150,
                xtype   : 'resourceassignmentcolumn'
            }
        ],
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore,
        taskStore       : taskStore,
        stripeRows      : true
    });

    var h = Ext.create('Gnt.panel.ResourceHistogram', {
        taskStore       : taskStore,
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore,
        viewPreset      : 'weekAndDayLetter',
        timelinePanel   : g,
        labelMode       : 'units',
        // showScaleLines      : true,
        scaleMax        : 8,
        scaleStep       : 1,
        scaleLabelStep  : 4,
        height          : ExampleDefaults.height / 2,
        width           : ExampleDefaults.width,
        startDate       : new Date(2010, 0, 11),
        endDate         : Sch.util.Date.add(new Date(2010, 0, 11), Sch.util.Date.WEEK, 20),
        renderTo        : 'example-container',
        listeners       : {
            barclick       : function (panel, context, ev) {
                console.log('barclick', panel, context, ev);
            },
            bardblclick    : function (panel, context, ev) {
                console.log('bardblclick', panel, context, ev);
            },
            barcontextmenu : function (panel, context, ev) {
                console.log('barcontextmenu', panel, context, ev);
            }
        }
    });

});
