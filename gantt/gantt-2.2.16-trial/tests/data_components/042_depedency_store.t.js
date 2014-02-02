StartTest(function (t) {

    var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        data: [
            { Id: 123, From: 1, To: 2, Type: 2 },
            { Id: 124, From: 2, To: 3, Type: 2 }
        ]
    });

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        dependencyStore: dependencyStore,

        proxy: {
            type: 'memory',
            reader: {
                type: 'json'
            }
        },

        root: {
            expanded: false,

            children: [
                {
                    Id: 1,
                    leaf: true,
                    StartDate: new Date(2011, 6, 1),
                    EndDate: new Date(2011, 6, 2)
                },
                {
                    Id: 2,
                    leaf: true,
                    StartDate: new Date(2011, 6, 2),
                    EndDate: new Date(2011, 6, 3)
                },
                {
                    Id: 3,
                    leaf: true,
                    StartDate: new Date(2011, 6, 3),
                    EndDate: new Date(2011, 6, 4)
                }
            ]
        }
    });
    
    t.verifyCachedDependenciesState(taskStore)

    var dep = dependencyStore.first();

    t.ok(dep.isPersistable(), 'Dep is ok to persist');

    var newTask = new Gnt.model.Task();
    
    t.isDeeply(dependencyStore.getDependenciesForTask(newTask), [], 'getDependenciesForTask returns empty array');
    
    taskStore.getRootNode().appendChild(newTask);
    
    t.verifyCachedDependenciesState(taskStore)

    dep.setTargetTask(newTask);
    
    t.verifyCachedDependenciesState(taskStore)
    
    t.notOk(dep.isPersistable(), 'Dep is no longer ok to persist');

    t.isDeeply(dependencyStore.getDependenciesForTask(newTask), [ dep ], 'getDependenciesForTask');
    t.isDeeply(dependencyStore.getIncomingDependenciesForTask(newTask), [ dep ], 'getIncomingDependenciesForTask');
    t.isDeeply(dependencyStore.getOutgoingDependenciesForTask(newTask), [], 'getOutgoingDependenciesForTask empty');
    t.isDeeply(dependencyStore.getOutgoingDependenciesForTask(taskStore.getRootNode().firstChild), [ dep ], 'getOutgoingDependenciesForTask empty');

    dep.reject();
    
    t.verifyCachedDependenciesState(taskStore)
    
    t.ok(dependencyStore.hasTransitiveDependency(1, 2), 'hasTransitiveDependency works on directly depended tasks');
    t.ok(dependencyStore.hasTransitiveDependency(1, 3), 'hasTransitiveDependency');
    t.notOk(dependencyStore.hasTransitiveDependency(3, 1), 'hasTransitiveDependency returns empty');
    
    t.ok(dependencyStore.isValidDependency(dep), 'isValidDependency called with dependency');
    
    // Creates circular link
    dep.setSourceId(3);
    
    t.verifyCachedDependenciesState(taskStore)
    
    t.notOk(dependencyStore.isValidDependency(dep), 'isValidDependency called with dependency - bad dependency');
    dep.reject();
    
    t.verifyCachedDependenciesState(taskStore)

    t.notOk(dependencyStore.isValidDependency(3, 1), 'isValidDependency called with ids - bad dependency - cycle');
    t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency called with ids - bad dependency - transitivity');
    
    t.ok(dependencyStore.areTasksLinked(1, 2), 'areTasksLinked');
    t.notOk(dependencyStore.areTasksLinked(1, 3), 'areTasksLinked falsy');
    t.notOk(dependencyStore.areTasksLinked(4, 1), 'areTasksLinked bad first task');
    t.notOk(dependencyStore.areTasksLinked(1, 4), 'areTasksLinked bad second task');
    
    var newDependency       = new Gnt.model.Dependency({
        From        : 2,
        To          : 1,
        Type        : 2
    })
    
    t.notOk(dependencyStore.isValidDependency(newDependency), "Dependency is not valid, since its will form a circular structure 1->2->1")
    
    newDependency           = new Gnt.model.Dependency({
        From        : 1,
        To          : 1,
        Type        : 2
    })
    
    t.notOk(dependencyStore.isValidDependency(newDependency), "Dependency from itself is not valid")
    
    newDependency           = new Gnt.model.Dependency({
        From        : "1",
        To          : 1,
        Type        : 2
    })
    
    t.notOk(dependencyStore.isValidDependency(newDependency), "Dependency from itself is not valid")
    
})    
