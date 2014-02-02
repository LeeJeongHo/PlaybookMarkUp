StartTest(function(t) {
    t.diag('Gantt not rendered');

    var assignmentStore = t.getAssignmentStore();
    var resourceStore = t.getResourceStore();
    var dependencyStore = t.getDependencyStore();

    var taskStore = t.getTaskStore({
        dependencyStore : dependencyStore,
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore
    });

    t.snapShotListeners(taskStore, 'taskStore');
    t.snapShotListeners(taskStore.nodeStore, 'nodeStore');
    t.snapShotListeners(dependencyStore, 'dependencyStore');
    t.snapShotListeners(resourceStore, 'resourceStore');
    t.snapShotListeners(assignmentStore, 'assignmentStore');

    var g = t.getGantt({
        taskStore       : taskStore,
        assignmentStore : assignmentStore,
        resourceStore   : resourceStore,
        dependencyStore : dependencyStore
    });

    // Should clean all listeners
    g.destroy();

    t.verifyListeners(taskStore,  'taskStore', 'Listeners cleaned up on taskStore');
    t.verifyListeners(assignmentStore,  'assignmentStore', 'Listeners cleaned up on assignmentStore');
    t.verifyListeners(dependencyStore,  'dependencyStore', 'Listeners cleaned up on dependencyStore');
    t.verifyListeners(resourceStore,  'resourceStore', 'Listeners cleaned up on resourceStore');
    t.verifyListeners(taskStore.nodeStore,  'nodeStore', 'Listeners cleaned up on nodeStore');

    t.diag('Gantt rendered then destroyed');

    g = t.getGantt({
        renderTo        : Ext.getBody(),
        columnLines     : true,
        taskStore       : taskStore,
        assignmentStore : assignmentStore,
        resourceStore   : resourceStore,
        dependencyStore : dependencyStore
    });

    // Triggers datachanged which (if view listeners are not purged from all stores) will call refresh on the stale Ext.view.Locking instance
    assignmentStore.loadData([ { foo : 'bar' } ]);

    g.destroy();

    t.verifyListeners(taskStore,  'taskStore', 'Rendered: Listeners cleaned up on taskStore');
    t.verifyListeners(assignmentStore,  'assignmentStore', 'Rendered: Listeners cleaned up on assignmentStore');
    t.verifyListeners(dependencyStore,  'dependencyStore', 'Rendered: Listeners cleaned up on dependencyStore');
    t.verifyListeners(resourceStore,  'resourceStore', 'Rendered: Listeners cleaned up on resourceStore');
    t.verifyListeners(taskStore.nodeStore,  'nodeStore', 'Rendered: Listeners cleaned up on nodeStore');
});
