Ext.Loader.setConfig({ enabled: true, disableCaching : true });
Ext.Loader.setPath('App', 'js');

Ext.require([
    'App.view.GanttPanel'
]);

Ext.onReady(function () {
    App.init();
    Ext.QuickTips.init();
});

TaskPriority = {
    Low: 0,
    Normal: 1,
    High: 2
};

App = {

    // Initialize application
    init: function () {
        var dependencyStore = Ext.create("App.store.Dependency");

        var resourceStore = Ext.create("Gnt.data.ResourceStore");

        var assignmentStore = Ext.create("App.store.Assignment", {
            // Must pass a reference to resource store
            resourceStore: resourceStore
        });

        var start = new Date(2010, 1, 1),
            end = Sch.util.Date.add(start, Sch.util.Date.MONTH, 10);

        var taskStore = Ext.create("App.store.Task");

        var g = Ext.create("App.view.GanttPanel", {
            height: 500,
            width: 1000,
            renderTo: Ext.getBody(),
            startDate: start,
            endDate: end,
            taskStore : taskStore,
            assignmentStore : assignmentStore,
            dependencyStore : dependencyStore,
            resourceStore : resourceStore
        });
    }
};
