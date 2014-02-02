StartTest(function(t) {
    
    var dependencyStore = t.getDependencyStore({
        data : [
            {
                Id      : 1,
                From    : 1,
                To      : 2,
                Type    : 2,
                Lag     : 0
            }
        ]
    });
    
    var taskStore = Ext.create("Gnt.data.TaskStore", {
        dependencyStore : dependencyStore,
            
        proxy       : {
            type    : 'memory',
            reader  : {
                type    : 'json'
            }
        },
            
        root        : {
            expanded    : false,
                
            children    : [
                {
                    Id          : 1,
                    leaf        : true,
                    StartDate   : new Date(2011, 6, 1),
                    EndDate     : new Date(2011, 6, 2)
                },
                {
                    Id          : 2,
                    leaf        : true,
                    StartDate   : new Date(2011, 6, 2),
                    EndDate     : new Date(2011, 6, 3)
                },
                {
                    Id          : 3,
                    leaf        : true,
                    StartDate   : new Date(2011, 6, 2),
                    EndDate     : new Date(2011, 6, 3)
                }
            ]
        }
    });
        
    var task1 = taskStore.getRootNode().childNodes[0];
    var task2 = taskStore.getRootNode().childNodes[1];
    var task3 = taskStore.getRootNode().childNodes[2];
    
    var dep = dependencyStore.first(),
        Type = Gnt.model.Dependency.Type;

    t.ok(Type, 'Found Type');
    t.ok("StartToStart" in Type, 'Found StartToStart in Type');
    t.ok("StartToEnd" in Type, 'Found StartToEnd in Type');
    t.ok("EndToStart" in Type, 'Found EndToStart in Type');
    t.ok("EndToEnd" in Type, 'Found EndToEnd in Type');

    t.is(dep.getTaskStore(), taskStore, 'Found task store on the dependency model');

    t.is(dep.getSourceTask(), task1, 'Found source task');
    t.is(dep.getTargetTask(), task2, 'Found target task');
    
    t.is(dependencyStore.getSourceTask(dep), task1, 'Found source task');
    t.is(dependencyStore.getTargetTask(dep), task2, 'Found target task');
    

    dep.setTargetTask(task3);
    t.is(dep.getTargetTask(), task3, 'Updated target task ok');

    var task4 = taskStore.getRootNode().appendChild(new Gnt.model.Task());
    dep.setTargetTask(task4);
    t.is(dep.getTargetTask(), task4, 'Phantom task works ok');
    
    dep.setLag(3);
    t.is(dep.getLag(), 3, 'get/set for Lag works ok');
})    
