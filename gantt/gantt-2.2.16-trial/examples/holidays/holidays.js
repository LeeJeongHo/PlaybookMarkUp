Ext.ns('App');

//Ext.Loader.setConfig({enabled: true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../../ExtScheduler2.x/js/Sch');
//Ext.Loader.setPath('Gnt', '../../js/Gnt');

Ext.require([
    'Gnt.panel.Gantt',
    'Gnt.column.StartDate',
    'Gnt.column.EndDate',
    'Gnt.column.Duration',
    'Sch.plugin.TreeCellEditing',
    'Gnt.widget.Calendar'
]);

Ext.onReady(function() { App.Gantt.init(); });

App.Gantt = {

    // Initialize application
    init: function (serverCfg) {
        Ext.QuickTips.init();

        var calendar        = new Gnt.data.Calendar({
            autoLoad : true,
            proxy : {
                type : 'ajax',
                api : { read : 'holidaydata.js' },
                reader : { type : 'json' }
            },
            listeners : {
                beforesync : function() { return false; }
            }
        });

        var taskStore = Ext.create("Gnt.data.TaskStore", {

            calendar        : calendar,

            proxy : {
                type    : 'ajax',
                method  : 'GET',
                url     : 'tasks.xml',
                reader  : {
                    type        : 'xml',
                    // records will have a 'Task' tag
                    record      : ">Task",
                    root        : "Tasks",
                    idProperty  : "Id"
                }
            },
            sorters: [{
                property        : 'leaf',
                direction       : 'ASC'
            }]
        });


        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            autoLoad    : true,
            proxy       : {
                type    : 'ajax',
                url     : 'dependencies.xml',
                method  : 'GET',
                reader  : {
                    type        : 'xml',
                    root        : 'Links',
                    record      : 'Link' // records will have a 'Link' tag
                }
            }
        });

        var startDate   = new Date(2010, 0, 11);
        var endDate     = Sch.util.Date.add(new Date(2010, 0, 11), Sch.util.Date.WEEK, 10);

        var gantt = Ext.create('Gnt.panel.Gantt', {
            height : ExampleDefaults.height,
            width : ExampleDefaults.width,
            renderTo : 'example-container',

            leftLabelField  : 'Name',
            loadMask                    : true,
            enableProgressBarResize     : true,
            enableDependencyDragDrop    : false,
            highlightWeekends           : true,
//            weekendsAreWorkdays                : false,  // uncomment to disable the skipping weekends/holidays functionality completely (empty calendar)
                                                    // (for compatibility with 1.x)

//            skipWeekendsDuringDragDrop  : false,  // uncomment to disable the skipping weekends/holidays functionality during d&d operations

            viewPreset      : 'weekAndDayLetter',

            startDate       : startDate,
            endDate         : endDate,

            tooltipTpl: new Ext.XTemplate(
                '<ul class="taskTip">',
                    '<li><strong>Task:</strong>{Name}</li>',
                    '<li><strong>Start:</strong>{[values._record.getDisplayStartDate("y-m-d")]}</li>',
                    '<li><strong>Duration:</strong> {[parseFloat(Ext.Number.toFixed(values.Duration, 1))]} {DurationUnit}</li>',
                    '<li><strong>Progress:</strong>{[Math.round(values.PercentDone)]}%</li>',
                '</ul>'
            ).compile(),

            // Setup your static columns
            columns         : [
                {
                    xtype       : 'namecolumn',
                    width       : 180
                },
                {
                    xtype       : 'startdatecolumn',
                    width       : 80
                },
                {
                    xtype       : 'enddatecolumn',
                    width       : 80
                },
                {
                    xtype       : 'durationcolumn',
                    width       : 70
                },
                {
                    header      : '% Done',
                    sortable    : true,
                    dataIndex   : 'PercentDone',
                    width       : 50,
                    align       : 'center'
                }
            ],

            taskStore           : taskStore,
            dependencyStore     : dependencyStore,

            plugins             : [
                Ext.create('Sch.plugin.TreeCellEditing', {
                    clicksToEdit: 1
                })
            ],
            tbar                : [
                {
                    text            : 'See calendar',
                    iconCls         : 'gnt-date',

                    menu            : [
                        {
                            xtype           : 'ganttcalendar',

                            calendar        : calendar,
                            startDate       : startDate,
                            endDate         : endDate,

                            showToday       : false
                        }
                    ]
                }
            ]
        });
    },

    initCalendar : function(eventStore, date) {
        Extensible.calendar.data.EventModel.override({
            idProperty : 'Id',

            set : function(field, val) {
                if (arguments.length === 2 && field === 'Date' && val) {
                    this.data.Id = val - 0;
                }
                this.callOverridden(arguments);
            }
        });

        var M = Extensible.calendar.data.EventMappings;

        M.EventId =   {name:'Id' };
        M.StartDate = {name:'Date', type: 'date'};
        M.EndDate   = {name:'Date', type: 'date'};
        M.Title     = {name:'Name', type: 'string'};

        Extensible.calendar.data.EventModel.reconfigure();

        Extensible.calendar.form.EventWindow.override({
            onSave : function() {
                this.hide();
                this.callOverridden(arguments);
            },
            onDelete : function() {
                this.hide();
                this.callOverridden(arguments);
            }
        });

        var cp = Ext.create('Extensible.calendar.CalendarPanel', {
            cls : 'extcal',
            showDayView: false,
            showMonthView: true,
            showMultiDayView: false,
            showWeekView: false,
            showMultiWeekView: false,
            eventStore: eventStore,

            renderTo: document.body,
            title: 'Basic Calendar',
            width: 500,
            height: 500
        });

        cp.setStartDate(date);
    }
};
