Ext.ns('App');

//Ext.Loader.setConfig({enabled: true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../../ExtScheduler2.x/js/Sch');
//Ext.Loader.setPath('Gnt', '../../js/Gnt');

Ext.require([
    'Gnt.panel.Gantt',
    'Gnt.column.PercentDone',
    'Gnt.column.StartDate',
    'Gnt.column.EndDate',
    'Sch.plugin.TreeCellEditing'
]);

Ext.onReady(function () {
    App.Gantt.init();
});

App.Gantt = {

    // Initialize application
    init : function (serverCfg) {
        Ext.QuickTips.init();

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            proxy : {
                type   : 'ajax',
                method : 'GET',
                url    : 'tasks.js',
                reader : {
                    type : 'json'
                }
            }
        });

        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            autoLoad : true,
            proxy    : {
                type   : 'ajax',
                url    : 'dependencies.xml',
                method : 'GET',
                reader : {
                    type   : 'xml',
                    root   : 'Links',
                    record : 'Link' // records will have a 'Link' tag
                }
            }
        });

        var g = Ext.create('Gnt.panel.Gantt', {
            height                   : ExampleDefaults.height,
            width                    : ExampleDefaults.width,
            renderTo                 : 'example-container',
            leftLabelField           : 'Name',
            highlightWeekends        : false,
            //showTodayLine: true,
            loadMask                 : true,
            enableProgressBarResize  : true,
            enableDependencyDragDrop : false,
            cascadeChanges           : false,
            startDate                : new Date(2010, 0, 4),
            endDate                  : Sch.util.Date.add(new Date(2010, 0, 4), Sch.util.Date.WEEK, 20),
            viewPreset               : 'weekAndDayLetter',

            eventRenderer : function (taskRecord) {
                return {
                    ctcls : taskRecord.get('Id') // Add a CSS class to the task element
                };
            },

            // Setup your static columns
            columns       : [
                {
                    xtype     : 'namecolumn',
                    width     : 160
                },
                {
                    xtype : 'startdatecolumn',
                    width : 70
                },
                {
                    xtype : 'enddatecolumn',
                    width : 70
                },
                {
                    xtype : 'percentdonecolumn'
                },
                {
                    xtype : 'earlystartdatecolumn',
                    width : 70
                },
                {
                    xtype : 'earlyenddatecolumn',
                    width : 70
                },
                {
                    xtype : 'latestartdatecolumn',
                    width : 70
                },
                {
                    xtype : 'lateenddatecolumn',
                    width : 70
                },
                {
                    xtype : 'slackcolumn',
                    width : 70
                }
            ],

            taskStore        : taskStore,
            dependencyStore  : dependencyStore,
            lockedGridConfig : {
                width       : 450
            },
            lockedViewConfig : {
                plugins : {
                    ptype           : 'treeviewdragdrop',
                    containerScroll : true
                }
            },

            tbar : [
                {
                    icon    : 'add.png',
                    text    : 'Add task programmatically to "Ext 4.x branch"',
                    handler : function () {
                        var task = taskStore.getRootNode().findChild('Name', 'Ext 4.x branch', true);

                        if (task) {
                            task.appendChild(new taskStore.model({
                                Name        : 'Woo, added dynamically!',
                                leaf        : true,
                                PercentDone : 30
                            })
                            );
                        }
                    }
                },
                '->',
                {
                    icon    : 'add.png',
                    text    : 'Add task to "Sencha releases"',
                    handler : function () {
                        var task = taskStore.getRootNode().findChild('Name', 'Sencha Releases');

                        if (task) {
                            task.insertChild(0, new taskStore.model({
                                Name        : 'Added as first child!',
                                leaf        : true,
                                PercentDone : 60,
                                StartDate   : new Date(2010, 0, 6),
                                EndDate     : new Date(2010, 0, 8)
                            })
                            );
                        }
                    }
                }
            ]
        });
    }
};
