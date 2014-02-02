StartTest(function(t) {

    // Checks for ResourceHistogram particular rows refreshing
    // Histogram shouldn`t do total panel refresh on changes of resource/task/assignment

    var resourceStore   = t.getResourceStore();

    var assignmentStore = t.getAssignmentStore();

    var dependencyStore = t.getDependencyStore();

    var taskStore = t.getTaskStore({
        cascadeChanges  : false,
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore,
        dependencyStore : dependencyStore
    });

    var histogram = new Gnt.panel.ResourceHistogram({
        taskStore           : taskStore,
        resourceStore       : resourceStore,
        assignmentStore     : assignmentStore,
        startDate           : new Date(2010, 1, 1),
        endDate             : new Date(2010, 1, 12),
        width               : 800,
        height              : 400,
        renderTo            : Ext.getBody()
    });

    t.diag("Histogram shouldn`t do total panel refresh on changes of resource/task/assignment");

    t.waitForEvent(histogram.getView().normalView, "viewready", function () {
        t.willFireNTimes(histogram.getView().lockedView, "itemupdate", 3, "Locked view: 3 times occured refresh of particular grid row");
        t.willFireNTimes(histogram.getView().normalView, "itemupdate", 3, "Normal view: 3 times occured refresh of particular grid row");

        t.wontFire(histogram.getView().lockedView, "refresh", "Locked view: No total panel refresh occured");
        t.wontFire(histogram.getView().normalView, "refresh", "Normal view: No total panel refresh occured");

        // resource change should cause itemupdate event
        resourceStore.getById("r1").setName("smth");

        // task change should cause itemupdate event
        taskStore.getById(118).setDuration(2);

        // assignment change should cause itemupdate event
        assignmentStore.remove(assignmentStore.getById("a1"));
    });

});
