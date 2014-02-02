Class('Bryntum.Test', {

    isa: Siesta.Test.ExtJS,
    
    methods: {
        
        isOnline: function () {
            return window.location.href.match(/bryntum\.com|ext-scheduler\.com/i)
        },

        dragOneTickForward: function (eventModel, scheduler, callback) {
            this.dragOneTick(eventModel, scheduler, callback);
        },

        dragOneTickBackward: function (eventModel, scheduler, callback) {
            this.dragOneTick(eventModel, scheduler, callback, true);
        },

        dragOneTick : function (eventModel, panel, callback, isBackward) {

            if (!panel.xtype) {
                callback = panel;
                panel = null;
            }

            panel = panel || this.cq1('ganttpanel');
            var eventEl = panel.getSchedulingView().getElementFromEventRecord(eventModel);
            var distance = panel.timeAxisViewModel.getTickWidth() * (isBackward ? -1 : 1);

            this.dragBy(eventEl, [distance, 0], callback);
        },

        getFirstScheduleRowEl : function(panel) {
            var Ext = this.global.Ext;
            return Ext.get(panel.getSchedulingView().getNode(0));
        },

        getFirstTaskEl : function (gantt) {
            try {
                return gantt.getSchedulingView().getEl().down('.sch-gantt-item')
            } catch (e) {
                return null
            }
        },

        getFirstLeafTaskEl : function (gantt) {
            try {
                return gantt.getSchedulingView().getElementFromEventRecord(this.getFirstLeafTask(gantt));
            } catch (e) {
                return null
            }
        },

        getFirstTaskBarEl : function (gantt) {
            try {
                return gantt.getSchedulingView().getEl().down('.sch-gantt-task-bar')
            } catch (e) {
                return null
            }
        },

        getFirstDependencyEl : function (gantt) {
            return gantt.getSchedulingView().getDependencyView().getDependencyElements().first();
        },

        getResourceStore: function (config) {
            var Ext = this.global.Ext;

            return Ext.create('Gnt.data.ResourceStore', Ext.apply({
                model: 'Gnt.model.Resource',

                data: [
                    { Id: 'r1', Name: 'Mike' },
                    { Id: 'r2', Name: 'Linda' },
                    { Id: 'r3', Name: 'Don' },
                    { Id: 'r4', Name: 'Karen' },
                    { Id: 'r5', Name: 'Doug' },
                    { Id: 'r6', Name: 'Peter' }
                ]
            }, config || {}));
        },
        
        
        getSchedulerResourceStore: function (config) {
            var Ext = this.global.Ext;

            return Ext.create('Sch.data.ResourceStore', Ext.apply({

                data: [
                    { Id: 'r1', Name: 'Mike' },
                    { Id: 'r2', Name: 'Linda' },
                    { Id: 'r3', Name: 'Don' },
                    { Id: 'r4', Name: 'Karen' },
                    { Id: 'r5', Name: 'Doug' },
                    { Id: 'r6', Name: 'Peter' }
                ]
            }, config || {}));
        },
        
        
        getAssignmentStore: function (config) {
            var Ext = this.global.Ext;

            return Ext.create('Gnt.data.AssignmentStore', Ext.apply({
                model: 'Gnt.model.Assignment',

                data: [
                    { Id: 'a1', ResourceId: 'r1', TaskId : 117, Units : 50 },
                    { Id: 'a2', ResourceId: 'r2', TaskId : 118 },
                    { Id: 'a3', ResourceId: 'r3', TaskId : 115 }
                ]
            }, config || {}));
        },

        getEventStore: function (config) {
            var Ext = this.global.Ext

            return Ext.create('Sch.data.EventStore', Ext.apply({
                data: [
                    { Id: 'e10', ResourceId: 'r1', Name: 'Assignment 1', StartDate: "2011-01-04", EndDate: "2011-01-06" },
                    { Id: 'e11', ResourceId: 'r2', Name: 'Assignment 1', StartDate: "2011-01-05", EndDate: "2011-01-08" },
                    { Id: 'e21', ResourceId: 'r3', Name: 'Assignment 2', StartDate: "2011-01-06", EndDate: "2011-01-08" },
                    { Id: 'e22', ResourceId: 'r4', Name: 'Assignment 2', StartDate: "2011-01-07", EndDate: "2011-01-09" },
                    { Id: 'e32', ResourceId: 'r5', Name: 'Assignment 3', StartDate: "2011-01-03", EndDate: "2011-01-05" },
                    { Id: 'e33', ResourceId: 'r6', Name: 'Assignment 3', StartDate: "2011-01-09", EndDate: "2011-01-11" }
                ]
            }, config || {}));
        },


        getScheduler: function (config) {
            var Ext = this.global.Ext;

            return Ext.create('Sch.panel.SchedulerGrid', Ext.apply({
                eventResizeHandles: 'both',

                startDate: new Date(2011, 0, 3),
                endDate: new Date(2011, 0, 13),

                viewPreset: 'dayAndWeek',

                width: 800,
                height: 600,

                viewConfig: {
                    barMargin: 2,
                    cellBorderWidth: 0
                },
                rowHeight: 30,

                eventRenderer: function (item, r, tplData, row) {
                    var bgColor;

                    switch (row % 3) {
                        case 0:
                            bgColor = 'lightgray';
                            break;
                        case 1:
                            bgColor = 'orange';
                            break;
                        case 2:
                            bgColor = 'lightblue';
                            break;
                    }

                    tplData.style = "background-color:" + bgColor;
                    tplData.cls = "custom-css-class";

                    return item.get('Name');
                },

                // Setup static columns
                columns: [
                    { header: 'Name', sortable: true, width: 100, dataIndex: 'Id' }
                ],

                resourceStore: this.getSchedulerResourceStore(),
                eventStore: this.getEventStore()

            }, config || {}));
        },


        getDependencyStore: function (config) {
            var Ext = this.global.Ext;

            return Ext.create("Gnt.data.DependencyStore", Ext.apply({
                autoLoad: false,

                data: [{ "From": 117, "To": 115, "Id": 30, "Type": 2 }, { "From": 118, "To": 115, "Id": 31, "Type": 2 }, { "From": 115, "To": 116, "Id": 32, "Type": 2 }, { "From": 121, "To": 120, "Id": 33, "Type": 2}]
            }, config || {}))
        },


        getTaskStore: function (config, doNotLoad) {
            config = config || {};

            var Ext = this.global.Ext;

            var taskStore = Ext.create('Gnt.data.TaskStore', Ext.apply({
                cascadeChanges: true,
                cascadeDelay: 0,

                autoSync: false,
                autoLoad: false,

                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json'
                    },

                    data: config.DATA || [{
                        "children": [{
                            "leaf": true,
                            "Id": 117,
                            "StartDate": "2010-02-03T00:00:00",
                            "PercentDone": 0,
                            "Name": "New task 1",
                            "Duration": 6,
                            "DurationUnit": "d",
                            "parentId": 114,
                            "index": 0,
                            "Priority": 1
                        }, {
                            "leaf": true,
                            "Id": 118,
                            "StartDate": "2010-02-03T00:00:00",
                            "PercentDone": 0,
                            "Name": "New task 2",
                            "Duration": 6,
                            "DurationUnit": "d",
                            "parentId": 114,
                            "index": 1,
                            "Priority": 1
                        }],
                        "leaf": false,
                        "expanded": true,
                        "Id": 114,
                        "StartDate": "2010-02-03T00:00:00",
                        "PercentDone": 0,
                        "Name": "New task 3",
                        "Duration": 6,
                        "DurationUnit": "d",
                        "parentId": null,
                        "index": 0,
                        "Priority": 1
                    }, {
                        "leaf": true,
                        "Id": 115,
                        "StartDate": "2010-02-14T00:00:00",
                        "PercentDone": 0,
                        "Name": "New task 4",
                        "Duration": 5,
                        "DurationUnit": "d",
                        "parentId": null,
                        "index": 1,
                        "Priority": 1
                    }, {
                        "leaf": true,
                        "Id": 116,
                        "StartDate": "2010-02-21T00:00:00",
                        "PercentDone": 0,
                        "Name": "New task 5",
                        "Duration": 5,
                        "DurationUnit": "d",
                        "parentId": null,
                        "index": 2,
                        "Priority": 1
                    }, {
                        "children": [{
                            "leaf": true,
                            "Id": 121,
                            "StartDate": "2010-02-03T00:00:00",
                            "PercentDone": 0,
                            "Name": "New task 6",
                            "Duration": 6,
                            "DurationUnit": "d",
                            "parentId": 119,
                            "index": 0,
                            "Priority": 1
                        }],
                        "leaf": false,
                        "expanded": true,
                        "Id": 119,
                        "StartDate": "2010-02-03T00:00:00",
                        "PercentDone": 0,
                        "Name": "New task 7",
                        "Duration": 6,
                        "DurationUnit": "d",
                        "parentId": null,
                        "index": 3,
                        "Priority": 1
                    }, {
                        "children": null,
                        "leaf": true,
                        "expanded": false,
                        "Id": 120,
                        "StartDate": "2010-02-11T00:00:00",
                        "PercentDone": 0,
                        "Name": "New task 8",
                        "Duration": 7,
                        "DurationUnit": "d",
                        "parentId": null,
                        "index": 4,
                        "Priority": 1
                    }]
                },

                root: {
                    Id          : 'Root',
                    loaded      : true,
                    expanded    : true
                }
            }, config || {}));


            if (!doNotLoad) {
                taskStore.load();
            }

            return taskStore;
        },

        getFirstTaskWithOutgoingDeps : function(gantt) {
            var task;
            gantt.taskStore.getRootNode().cascadeBy(function(node) {
                if (node.getOutgoingDependencies().length > 0) {
                    task = node;
                    return false;
                }
            });
            return task;
        },

        getFirstParentTask : function(gantt) {
            var task;
            gantt.taskStore.getRootNode().cascadeBy(function(node) {
                if (!node.data.root && !node.isLeaf()) {
                    task = node;
                    return false;
                }
            });
            return task;
        },

        getFirstLeafTask : function(ganttOrTaskStore) {
            var task,
                store = ganttOrTaskStore instanceof this.global.Gnt.data.TaskStore ? ganttOrTaskStore : ganttOrTaskStore.taskStore;
            
            store.getRootNode().cascadeBy(function(node) {
                if (!task && node.isLeaf()) {
                    task = node;
                    return false;
                }
            });
            return task;
        },
        
        // Returns a gantt with minimal locked section
        getGantt2: function (config, cls) {
            config.lockedGridConfig = config.lockedGridConfig || {};
            config.lockedGridConfig.width = 50;

            return this.getGantt(config);
        },

        getGantt: function (config, cls) {
            var Ext         = this.global.Ext;
            var DATE        = this.global.Sch.util.Date;
            var Date        = this.global.Date;
            config          = config || {}

            return Ext.create(cls || 'Gnt.panel.Gantt', Ext.apply({
                height: 350,
                width: 1000,

                leftLabelField: 'Name',

                viewPreset: 'weekAndDayLetter',
                startDate: new Date(2010, 0, 4),
                endDate: DATE.add(new Date(2010, 0, 4), DATE.WEEK, 10),


                // Setup your static columns
                columns: [
                    {
                        xtype: 'treecolumn',
                        header: 'Tasks',
                        sortable: true,
                        dataIndex: 'Id',
                        width: 200,
                        editor : {}
                    },
                    {
                        xtype : 'startdatecolumn'
                    },
                    {
                        xtype : 'enddatecolumn'
                    },
                    {
                        xtype : 'percentdonecolumn'
                    }
                ],

                taskStore: config.taskStore || this.getTaskStore(),
                dependencyStore: config.dependencyStore || this.getDependencyStore()
            }, config));
        },

        
        waitForEventsToRender: function (timelinePanel, callback, scope) {
            var Ext         = this.global.Ext;

            if (!(timelinePanel instanceof Ext.Component)) {
                // For ease of testing a single scheduler, grab whatever we find
                scope = callback;
                callback = timelinePanel;
                timelinePanel = this.cq1('ganttpanel[lockable=true]');
            }

            if (!timelinePanel || !callback) {
                throw 'Must provide a panel to observe, and a callback function';
            }

            this.waitForSelector(timelinePanel.getSchedulingView().eventSelector, timelinePanel.el, callback, scope);
        },
        

        waitForTasksAndDependenciesToRender: function (timelinePanel, callback, scope) {
            var Ext         = this.global.Ext;

            if (!(timelinePanel instanceof Ext.Component)) {
                // For ease of testing a single panel, grab whatever we find
                scope = callback;
                callback = timelinePanel;
                timelinePanel = this.cq1('ganttpanel');
            }

            this.waitForSelector('.' + timelinePanel.getSchedulingView().getDependencyView().dependencyCls, timelinePanel.el, callback, scope);
        },

        
        isStartEnd: function (task, startDate, endDate, description) {
            var taskStartDate       = task.getStartDate()
            var taskEndDate         = task.getEndDate()
            
            if (taskStartDate - startDate == 0 && taskEndDate - endDate == 0)
                this.pass(description)
            else
                this.fail(description, {
                    assertionName       : 'isStartEnd',
                    got                 : "start: " + taskStartDate + ", end: " + taskEndDate,
                    need                : "start: " + startDate + ", end: " + endDate
                })
        },
        
        
        getBusinessTimeCalendar : function (config) {
            var Ext     = this.Ext()
            var Date    = this.global.Date;

            return Ext.create('Gnt.data.calendar.BusinessTime', Ext.apply({
                
                data    : [
                    {
                        Date            : new Date(2011, 6, 16),
                        
                        IsWorkingDay    : true,
                        
                        Availability    : [ '11:00-16:00', '17:00-20:00' ]
                    },
                    {
                        Date            : new Date(2011, 6, 17),
                        
                        IsWorkingDay    : true,
                        
                        Availability    : [ '12:00-16:00' ]
                    }
                ]
            }, config))
        },
        
        
        getCalendar : function (config) {
            var Ext     = this.Ext();
            
            return Ext.create('Gnt.data.Calendar', Ext.apply({
                
            }, config));
        },
        
        
        // start of `getSampleDataSet1` ========================================================================================================================
        getSampleDataSet1 : function () {
            var Ext             = this.Ext()
            var Date            = this.global.Date;

            var calendar    = Ext.create('Gnt.data.calendar.BusinessTime', {
                calendarId      : 'Project',
                
                data    : [
                    // will affect Task2 - weekend will be working day with non-standard availability
                    {
                        Date            : new Date(2011, 6, 16),
                        IsWorkingDay    : true,
                        Availability    : [ '11:00-16:00', '17:00-20:00' ]
                    },
                    {
                        Date            : new Date(2011, 6, 17),
                        IsWorkingDay    : true,
                        Availability    : [ '12:00-16:00' ]
                    }
                ]
            })
            
            // task4 has 26 as non-working day
            var calendar1    = Ext.create('Gnt.data.calendar.BusinessTime', {
                calendarId      : 'Task4',
                
                parent          : 'Project', 
                
                data    : [
                    {
                        Date            : new Date(2011, 6, 26),
                        IsWorkingDay    : false
                    }
                ]
            })
            
            var calendar2    = Ext.create('Gnt.data.calendar.BusinessTime', {
                calendarId      : 'Res5',
                
                parent          : 'Project',
                
                data    : [
                    {
                        Date            : new Date(2011, 6, 25),
                        IsWorkingDay    : true,
                        // can work only 3 hours on 25th (task calendar has 12:00-13:00 as lunch time)
                        Availability    : [ '12:00-16:00' ]
                    }
                ]
            })
            
            var calendar3    = Ext.create('Gnt.data.calendar.BusinessTime', {
                calendarId      : 'Res6',
                
                parent          : 'Project',
                
                data    : [
                    {
                        Date            : new Date(2011, 6, 27),
                        IsWorkingDay    : true,
                        // can work only 1 hours on 27th (task calendar is till 17:00)
                        Availability    : [ '16:00-21:00' ]
                    }
                ]
            })
            
            var resourceStore   = Ext.create("Gnt.data.ResourceStore", {
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                
                data    : [
                    {
                        Id          : 'Res1',
                        Name        : 'John'
                    },
                    {
                        Id          : 'Res2',
                        Name        : 'Mike'
                    },
                    // free resource, don't assign in initial data package
                    {
                        Id          : 'Res3',
                        Name        : 'Fred'
                    },
                    {
                        Id          : 'Res4',
                        Name        : 'Jay'
                    },
                    {
                        Id          : 'Res5',
                        Name        : 'John',
                        
                        CalendarId  : 'Res5'
                    },
                    {
                        Id          : 'Res6',
                        Name        : 'Jim',
                        
                        CalendarId  : 'Res6'
                    },
                    // free resource, don't assign in initial data package
                    {
                        Id          : 'Res7',
                        Name        : 'Mark'
                    },
                    // free resource, don't assign in initial data package
                    {
                        Id          : 'Res8',
                        Name        : 'Jake'
                    }
                ]
            });

            var assignmentStore   = Ext.create("Gnt.data.AssignmentStore", {
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                
                data    : [
                    {
                        Id          : 'Assnmt1',
                        ResourceId  : 'Res1',
                        TaskId      : 1,
                        Units       : 100
                    },
                    {
                        Id          : 'Assnmt2',
                        ResourceId  : 'Res2',
                        TaskId      : 1,
                        Units       : 100
                    },
                    {
                        Id          : 'Assnmt3',
                        ResourceId  : 'Res4',
                        TaskId      : 2
                    },
                    {
                        Id          : 'Assnmt4',
                        ResourceId  : 'Res5',
                        TaskId      : 4,
                        Units       : 80
                    },
                    {
                        Id          : 'Assnmt5',
                        ResourceId  : 'Res6',
                        TaskId      : 4,
                        Units       : 80
                    }
                ]
            });
            
            
            var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                
                data    : [
                    {
                        From        : 1,
                        To          : 2,
                        Type        : 2
                    },
                    {
                        From        : 1,
                        To          : 3,
                        Type        : 2
                    },
                    {
                        From        : 2,
                        To          : 4,
                        Type        : 2
                    },
                    {
                        From        : 3,
                        To          : 4,
                        Type        : 2
                    },
                    {
                        From        : 4,
                        To          : 5,
                        Type        : 2
                    }
                ]
            });            
            
            var taskStore = Ext.create("Gnt.data.TaskStore", {
                dependencyStore : dependencyStore,
                resourceStore   : resourceStore,
                assignmentStore : assignmentStore,
                calendar        : calendar,
                
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                
                root        : {
                    expanded    : false,
                    
                    // do we need to specify the hours in tasks Start/End dates now?
                    children    : [
                        {
                            Id          : 1,
                            leaf        : true,
                            StartDate   : new Date(2011, 6, 1, 8, 0),
                            EndDate     : new Date(2011, 6, 4, 17, 0),

                            //Effort      : 32, // should be calculated by "normalization" process
                            
                            SchedulingMode  : 'FixedDuration'
                        },
                        {
                            Id          : 123,
                            
                            StartDate   : new Date(2011, 6, 15),
                            EndDate     : new Date(2011, 6, 23),
                            
                            children    : [
                                {
                                    Id          : 2,
                                    leaf        : true,
                                    StartDate   : new Date(2011, 6, 16, 11),
                                    EndDate     : new Date(2011, 6, 19, 17), // XXX EndDate should not be used? or do we normalize it?
                                    
                                    Effort          : 28,   // XXX Effort should not be used? or do we normalize it?
                                    
                                    SchedulingMode  : 'EffortDriven'
                                },
                                {
                                    Id          : 3,
                                    leaf        : true,
                                    StartDate   : new Date(2011, 6, 18, 8),
                                    EndDate     : new Date(2011, 6, 21, 17)
                                }
                            ]
                        },
                        {
                            Id          : 4,
                            leaf        : true,
                            StartDate   : new Date(2011, 6, 25, 8), // need to present for DynamicAssignment
                            EndDate     : new Date(2011, 6, 27, 17), // need to present for DynamicAssignment
                            
                            CalendarId      : 'Task4',
                            
                            Effort          : 16, // need to present for DynamicAssignment
                            
                            SchedulingMode  : 'DynamicAssignment'
                        },
                        // Milestone
                        {
                            Id          : 5,
                            leaf        : true,
                            StartDate   : new Date(2011, 6, 28, 8),
                            EndDate     : new Date(2011, 6, 28, 8)
                        }
                    ]
                }
            });
            
            return {
                calendar        : calendar,
                taskStore       : taskStore,
                dependencyStore : dependencyStore,
                resourceStore   : resourceStore,
                assignmentStore : assignmentStore
            }
        },
        // eof `getSampleDataSet1` ========================================================================================================================
        

        // start of `getSampleDataSet2` ========================================================================================================================
        getSampleDataSet2 : function () {
            var Ext             = this.Ext()
            var Date            = this.global.Date;

            var calendar    = Ext.create('Gnt.data.calendar.BusinessTime', { 
                calendarId      : 'Project'
            })
            
            var calendar1   = Ext.create('Gnt.data.calendar.BusinessTime', {
                calendarId      : 'Task1',
                
                parent          : 'Project',
                
                data    : [
                    {
                        Date            : new Date(2011, 6, 2),
                        IsWorkingDay    : true,
                        Availability    : [ '11:00-16:00', '17:00-20:00' ]
                    },
                    {
                        Date            : new Date(2011, 6, 3),
                        IsWorkingDay    : true,
                        Availability    : [ '12:00-16:00' ]
                    }
                ]
            })
            
            var calendar2    = Ext.create('Gnt.data.calendar.BusinessTime', {
                calendarId      : 'Res2',
                
                parent          : 'Project',
                
                data    : [
                    {
                        Date            : new Date(2011, 6, 1),
                        IsWorkingDay    : true,
                        Availability    : [ '13:00-16:00' ]
                    },
                    {
                        Date            : new Date(2011, 6, 2),
                        IsWorkingDay    : true,
                        Availability    : [ '09:00-14:00' ]
                    }
                ]
            })
            
            var calendar3    = Ext.create('Gnt.data.calendar.BusinessTime', {
                calendarId      : 'Res3',
                
                parent          : 'Project',
                
                data    : [
                    {
                        Date            : new Date(2011, 6, 2),
                        IsWorkingDay    : true,
                        Availability    : [ '12:00-19:00' ]
                    },
                    {
                        Date            : new Date(2011, 6, 4)
                    }
                ]
            })
            
            var calendar4    = Ext.create('Gnt.data.calendar.BusinessTime', {
                calendarId      : 'Res4',
                
                parent          : 'Project',
                
                data    : [
                    {
                        Date            : new Date(2011, 6, 2),
                        IsWorkingDay    : true,
                        Availability    : [ '16:00-17:00' ]
                    },
                    {
                        Date            : new Date(2011, 6, 3),
                        IsWorkingDay    : true,
                        Availability    : [ '09:00-12:00', '13:00-14:00', '16:00-18:00' ]
                    },
                    {
                        Date            : new Date(2011, 6, 4),
                        IsWorkingDay    : true,
                        Availability    : [ '12:00-13:00' ]
                    }
                ]
            })
            
            
            var resourceStore   = Ext.create("Gnt.data.ResourceStore", {
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                
                data    : [
                    {
                        Id          : 'Res1',
                        Name        : 'John',
                        CalendarId  : 'Task1'
                    },
                    {
                        Id          : 'Res2',
                        Name        : 'Mike',
                        CalendarId  : 'Res2'
                    },
                    {
                        Id          : 'Res3',
                        Name        : 'Fred',
                        CalendarId  : 'Res3'
                    },
                    {
                        Id          : 'Res4',
                        Name        : 'Jay',
                        CalendarId  : 'Res4'
                    }
                ]
            });

            var assignmentStore   = Ext.create("Gnt.data.AssignmentStore", {
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                data        : []
            });
            
            
            var taskStore = Ext.create("Gnt.data.TaskStore", {
                resourceStore   : resourceStore,
                assignmentStore : assignmentStore,
                calendar        : calendar,
                
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                
                root        : {
                    expanded    : false,
                    
                    // do we need to specify the hours in tasks Start/End dates now?
                    children    : [
                        {
                            Id              : 1,
                            leaf            : true,
                            StartDate       : new Date(2011, 6, 1, 8, 0),
                            EndDate         : new Date(2011, 6, 4, 17, 0),

                            SchedulingMode  : 'FixedDuration',
                            CalendarId      : 'Task1'
                        }
                    ]
                }
            });
            
            return {
                calendar        : calendar,
                taskStore       : taskStore,
                resourceStore   : resourceStore,
                assignmentStore : assignmentStore
            }
        },
        // eof `getSampleDataSet2` ========================================================================================================================
        
        
        // start of `getSampleDataSet3` ========================================================================================================================
        getSampleDataSet3 : function () {
            var Ext             = this.Ext()
            var Date            = this.global.Date;

            var projectCalendar   = Ext.create('Gnt.data.calendar.BusinessTime', { 
                calendarId      : 'Project'
            })
            
            var calendar1   = Ext.create('Gnt.data.calendar.BusinessTime', {
                calendarId      : 'Resource1',
                
                parent          : 'Project',
                
                data    : [
                    {
                        Date            : new Date(2012, 6, 2),
                        IsWorkingDay    : true,
                        Availability    : [ '13:00-17:00' ]
                    },
                    {
                        Date            : new Date(2012, 6, 3),
                        IsWorkingDay    : true,
                        Availability    : [ '13:00-17:00' ]
                    },
                    {
                        Date            : new Date(2012, 7, 3),
                        IsWorkingDay    : true,
                        Availability    : [ '15:00-20:00' ]
                    }
                ]
            })
            
            var resourceStore   = Ext.create("Gnt.data.ResourceStore", {
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                
                data    : [
                    {
                        Id          : 'Resource1',
                        Name        : 'Resource1',
                        CalendarId  : 'Resource1'
                    }
                ]
            });

            var assignmentStore   = Ext.create("Gnt.data.AssignmentStore", {
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                data        : [
                    {
                        "Id"            : "Assignment1",
                        "TaskId"        : "Task1",
                        "ResourceId"    : 'Resource1',
                        "Units"         : 100
                    }
                ]
            });

            
            var taskStore = Ext.create("Gnt.data.TaskStore", {
                resourceStore   : resourceStore,
                assignmentStore : assignmentStore,
                calendar        : projectCalendar,
                
                proxy       : { type    : 'memory', reader  : { type    : 'json' } },
                
                root        : {
                    expanded    : false,
                    
                    children    : [
                        {
                            Id              : "Task1",
                            leaf            : true,
                            StartDate       : new Date(2011, 6, 4, 8, 0),
                            Duration        : 4,
                            DurationUnit    : 'h'
                        },
                        // this task should not have any assignments!
                        // testing behavior of task w/o assignments
                        {
                            Id              : "Task2",
                            leaf            : true,
                            StartDate       : new Date(2011, 6, 4, 8, 0),
                            Duration        : 4,
                            DurationUnit    : 'h'
                        }
                    ]
                }
            });
            
            return {
                calendar        : projectCalendar,
                taskStore       : taskStore,
                resourceStore   : resourceStore,
                assignmentStore : assignmentStore
            }
        },
        // eof `getSampleDataSet3` ========================================================================================================================        
        
        
        sortByInternalId : function (records) {
            var Ext = this.Ext();
            
            return Ext.Array.sort(records, function (r1, r2) {
                var id1 = r1.getInternalId(),
                    id2 = r2.getInternalId();
    
                if (id1 > id2) return 1;
                if (id2 > id1) return -1;
                
                return 0;
            });
        },
        
        
        getTimeZone : function () {
            var Date        = this.global.Date;
            var date        = new Date()
            
            return date.toLocaleString().replace(/.*(GMT.*)/, '$1')
        },
        
        
        getDSTDates : function () {
            var Date        = this.global.Date;
            var yearStart   = new Date(2012, 0, 1)
            var yearEnd     = new Date(2012, 11, 31)
            
            var dstDates    = []
            var prev
            
            var Ext         = this.Ext()
            
            for (var i = yearStart; i <= yearEnd; i = Ext.Date.add(i, Ext.Date.DAY, 1)) {
                var midnightOffset  = new Date(2012, i.getMonth(), i.getDate()).getTimezoneOffset()
                var noonOffset      = new Date(2012, i.getMonth(), i.getDate(), 12).getTimezoneOffset()
                
                if (midnightOffset != noonOffset) dstDates.push(i)
            }
            
            return dstDates
        },

        snapShotListeners : function(observable, name) {
            this._observableData = this._observableData || {};

            if (!name) throw 'Must provide a name for the observable';

            this._observableData[name] = this.global.Ext.apply({}, observable.hasListeners);

            // Delete new 4.2 properties
            if ('_decr_' in this._observableData[name]) {
                delete this._observableData[name]._decr_;
                delete this._observableData[name]._incr_;
            }
        },

        verifyListeners : function(observable, name, description) {
            var needListeners = this._observableData[name];

            for (var o in observable.hasListeners) {
                // Skip some internal Ext JS stuff
                if (o !== "_decr_" && o !== "_incr_") {

                    this.is(observable.hasListeners[o], needListeners[o], o + ': ' + description);
                }
            }
        },

        getLargeDataset : function() {
            var Date    = this.global.Date
            var Ext     = this.Ext();

            var arr = [],
                i, j, k,
                cn, cn2,
                dt = new Date(2010, 0, 5);

            for (var i = 1; i < 10; i++) {
                cn = [];
                for (j = 1; j < 10; j++) {
                    cn2 = [];
                    for (k = 1; k < 10; k++) {
                        var nbr = (100*i)+(10*j)+k;
                        cn2.push({
                            Id          : nbr,
                            Name        : 'Child task ' + nbr,
                            StartDate   : dt,
                            EndDate     : Ext.Date.add(dt, Ext.Date.DAY, 2),
                            leaf        : true
                        });
                    }
                    cn.push({
                        Id          : 'Child task ' + String(i)+String(j),
                        Name        : 'Child task ' + String(i)+String(j),
                        StartDate   : dt,
                        EndDate     : Ext.Date.add(dt, Ext.Date.DAY, 2),
                        expanded    : true,
                        children    : cn2
                    });
                }
                arr.push({
                    Id          : 'Root task #' + i,
                    Name        : 'Root task #' + i,
                    StartDate   : new Date(2010, 0, 5),
                    EndDate     : dt,
                    children    : cn,
                    expanded    : true
                });
            }

            return arr;
        },

        moveByWithCallback : function(delta, callback, next) {
            var Ext = this.Ext();

            Ext.getBody().on('mousemove', callback);

            this.moveCursorBy(delta, function() {
                Ext.getBody().un('mousemove', callback);
                next();
            });
        },
        
        
        getTaskStoreAndDependencyStoreDataSet : function (taskStoreData, dependenciesData) {
            var Ext             = this.Ext()
            
            var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
                data    : dependenciesData || []
            });
    
    
            var taskStore = Ext.create("Gnt.data.TaskStore", {
                dependencyStore     : dependencyStore,
                cascadeChanges      : true,
                cascadeDelay        : 0,
    
                root                : {
                    expanded    : true,
                    children    : taskStoreData
                }
            });
    
            return {
                taskStore       : taskStore,
                dependencyStore : dependencyStore,
                depStore        : dependencyStore,
                root            : taskStore.getRootNode(),
                id              : function (id) { return taskStore.getById(id) },
                task            : function (id) { return taskStore.getById(id) },
                depId           : function (id) { return dependencyStore.getById(id) },
                dep             : function (id) { return dependencyStore.getById(id) }
            }
        },
        
        
        verifyCachedDependenciesState : function (taskStore, dependencyStore) {
            dependencyStore         = dependencyStore || taskStore.dependencyStore
            
            var me                  = this
            var tasksCopies         = {}
            
            dependencyStore.each(function (dependency) {
                var from            = dependency.getSourceTask(),
                    to              = dependency.getTargetTask();
                    
                if (from) {
                    var fromId      = from.getInternalId()
                    var fromCopy    = tasksCopies[ fromId ] = tasksCopies[ fromId ] || { successors : [], predecessors : [] }
                    
                    fromCopy.successors.push(dependency);
                }
                
                if (to) {
                    var toId        = to.getInternalId()
                    var toCopy      = tasksCopies[ toId ] = tasksCopies[ toId ] || { successors : [], predecessors : [] }
                    
                    toCopy.predecessors.push(dependency);
                }
            });
            
            var stateIsCorrect      = true
            
            taskStore.forEachTaskUnOrdered(function (task) {
                var taskCopy        = tasksCopies[ task.getInternalId() ]
                
                if (!taskCopy) {
                    if (task.successors.length || task.predecessors.length) {
                        me.fail("Can't find a copy for task: ", {
                            annotation      : 'Task id : ' + task.getInternalId()
                        })
                        
                        return stateIsCorrect = false
                    }
                } else {
                    if (!me.compareObjects(taskCopy.successors, task.successors)) {
                        me.fail("Successors of copy and real task does not match", {
                            got             : task.successors,
                            need            : taskCopy.successors,
                            
                            annotation      : 'Task id : ' + task.getInternalId()
                        })
                        
                        return stateIsCorrect = false
                    }
                    
                    if (!me.compareObjects(taskCopy.predecessors, task.predecessors)) {
                        me.fail("Predecessors of copy and real task does not match", {
                            got             : task.predecessors,
                            need            : taskCopy.predecessors,
                            
                            annotation      : 'Task id : ' + task.getInternalId()
                        })
                        
                        return stateIsCorrect = false
                    }
                }
            })
            
            if (stateIsCorrect) this.pass('Dependencies cache state is correct')
        },


        // copied from Scheduler test class
        bufferedRowsAreSync : function (grid, desc) {
            desc = desc || "Positions of rows in normal and locked views are synchronized"

            var normalView = grid.normalGrid.getView()
            var lockedView = grid.lockedGrid.getView()

            var normalNodes = normalView.all
            var lockedNodes = lockedView.all

            var sameCount = normalNodes.getCount() == lockedNodes.getCount()

            if (!sameCount) {
                this.fail(desc, {
                    assertionName : 'bufferedRowsAreSync',
                    annotation    : "The number of nodes in normal and locked views does not match: " + normalNodes.getCount() + ' and ' + lockedNodes.getCount()
                })
                return
            }

            var sameStartIndex = normalNodes.startIndex == lockedNodes.startIndex

            if (!sameStartIndex) {
                this.fail(desc, {
                    assertionName : 'bufferedRowsAreSync',
                    annotation    : "The start indicies of normal and locked views does not match: " + normalNodes.startIndex + ' and ' + lockedNodes.startIndex
                })
                return
            }

            var recordCount = (normalView.store.buffered ? normalView.store.getTotalCount() : normalView.store.getCount());

            if (recordCount && (normalNodes.endIndex === recordCount - 1)) {
                // verifying that content does not goes outside of the strecther when showing the last row in the dataset

                var normalStretcher = normalView.bufferedRenderer.stretcher
                var lockedStretcher = lockedView.bufferedRenderer.stretcher
                
                var diff            = normalStretcher.getHeight() + normalStretcher.getMargin('tb') - (normalView.body.dom.offsetTop + normalView.body.dom.offsetHeight)

                if (Math.abs(diff) > 1) {
                    this.fail(desc, {
                        assertionName : 'bufferedRowsAreSync',
                        annotation    : "The stretcher of the normal view has incorrect height: " + (normalStretcher.getHeight() + normalStretcher.getMargin('tb'))
                            + ' content ends at ' + (normalView.body.dom.offsetTop + normalView.body.dom.offsetHeight)
                    })
                    return
                }
                
                diff                = lockedStretcher.getHeight() + normalStretcher.getMargin('tb') - (lockedView.body.dom.offsetTop + lockedView.body.dom.offsetHeight)

                if (Math.abs(diff) > 1) {
                    this.fail(desc, {
                        assertionName : 'bufferedRowsAreSync',
                        annotation    : "The stretcher of the locked view has incorrect height: " + (lockedStretcher.getHeight() + lockedStretcher.getMargin('tb'))
                            + ' content ends at ' + (lockedView.body.dom.offsetTop + lockedView.body.dom.offsetHeight)
                    })
                    return
                }
            }

            var areTheSame = true

            for (var i = normalNodes.startIndex; i <= normalNodes.endIndex; i++)
                if (normalNodes.item(i).getY() != lockedNodes.item(i).getY()) {
                    areTheSame = false
                    break
                }

            if (areTheSame)
                this.pass(desc)
            else
                this.fail(desc, {
                    assertionName : 'bufferedRowsAreSync',
                    annotation    : "Vertical offset of normal row does not match to locked row: " + normalNodes.item(i).getY() 
                        + ' and ' + lockedNodes.item(i).getY() + '\n' 
                        + 'Nodes index: ' + (i - normalNodes.startIndex) + ", normal row id: " + normalNodes.item(i).id + ", locked row id: " + lockedNodes.item(i).id + '\n'
                        + 'Record id: ' + normalView.store.getAt(i).getId()
                })
        },
        
        
        getLocatorById : function (taskStore) {
            return function (id) {
                return taskStore.getById(id)
            }
        }
    }
    // eof methods
})