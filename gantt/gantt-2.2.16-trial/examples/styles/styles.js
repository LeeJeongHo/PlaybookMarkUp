Ext.ns('App');

//Ext.Loader.setConfig({enabled: true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../../ExtScheduler2.x/js/Sch');
//Ext.Loader.setPath('Gnt', '../../js/Gnt');

Ext.require([
    'Gnt.panel.Gantt',
    'Gnt.column.PercentDone',
    'Gnt.column.StartDate',
    'Gnt.column.EndDate',
    'Sch.plugin.Pan',
    'Gnt.plugin.DependencyEditor'
]);

Ext.onReady(function() {App.Gantt.init(); });

App.Gantt = {

    // Initialize application
    init : function(serverCfg) {
        Ext.QuickTips.init();

        Ext.define('MyModel', {
            extend  : 'Gnt.model.Task',
            fields  : [ 'CustomPercentDone' ]
        });

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            model       : 'MyModel',

            proxy       : {
                type        : 'ajax',
                method      : 'GET',
                url         : 'tasks.js',
                reader      : {
                    type    : 'json'
                }
            }
        });

        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            autoLoad    : true,
            proxy       : {
                type    : 'ajax',
                url     : 'dependencies.js',
                method  : 'GET',
                reader  : {
                    type : 'json'
                }
            }
        });

        var g = Ext.create("Gnt.panel.Gantt", {
            height                      : ExampleDefaults.height,
            width                       : ExampleDefaults.width,
            renderTo                    : 'example-container',

            leftLabelField              : 'Name',

            highlightWeekends           : true,
            showTodayLine               : true,
            loadMask                    : true,
            enableDependencyDragDrop    : false,
            taskBodyTemplate            : '<div class="sch-gantt-progress-bar" style="width:{percentDone}%;{progressBarStyle}" unselectable="on">&#160;</div>' +
                '<div class="other-progress-bar" style="width:{[values.record.data.CustomPercentDone]}%;" unselectable="on">&#160;</div>',

            viewConfig                  : { trackOver : false },

            tbar : [
                {
                    text    : 'Style 1',
                    iconCls : 'theme',
                    scale   : 'large',
                    handler : function() {
                        Ext.getBody().removeCls(['style2', 'style3']).addCls('style1');
                    }
                },
                {
                    text    : 'Style 2',
                    iconCls : 'theme',
                    scale   : 'large',
                    handler : function() {
                        Ext.getBody().removeCls(['style1', 'style3']).addCls('style2');
                    }
                },
                {
                    iconCls : 'theme',
                    text    : 'Style 3',
                    scale   : 'large',
                    handler : function() {
                        Ext.getBody().removeCls(['style2', 'style1']).addCls('style3');
                    }
                }
            ],

            startDate   : new Date(2010, 0, 11),
            endDate     : Sch.util.Date.add(new Date(2010, 0, 4), Sch.util.Date.WEEK, 20),
            viewPreset  : 'weekAndDayLetter',

            // Setup your static columns
            columns     : [
                {
                    xtype       : 'namecolumn',
                    width       : 250
                }
            ],
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            trackMouseOver  : false,
            stripeRows      : true
        });
    }
};
