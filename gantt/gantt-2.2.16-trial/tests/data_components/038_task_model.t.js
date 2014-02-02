StartTest(function(t) {
    
    var getDataSet = function () {
        var dependencyStore = Ext.create("Gnt.data.DependencyStore");
        
    
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
                        EndDate     : new Date(2011, 6, 5)
                    }
                ]
            }
        });
        
        return {
            taskStore       : taskStore,
            dependencyStore : dependencyStore
        }
    }
    
    var dataSet             = getDataSet()
    
    var taskStore           = dataSet.taskStore
    var dependencyStore     = dataSet.dependencyStore
    
    var task = taskStore.getRootNode().firstChild;

    t.ok(task.isLeaf(), 'Task originally leaf');

    var newTask = new taskStore.model();
    task.addSubtask(newTask);
    t.notOk(task.isLeaf(), 'Task not leaf');
    t.is(task.firstChild, newTask, 'Found sub task');

    newTask = new taskStore.model();
    task.addSuccessor(newTask);
    t.is(task.nextSibling, newTask, 'Successor added at correct position');
    t.is(task.getSuccessors()[0], newTask, 'Successor linked to the task');
    t.is(dependencyStore.first().getType(), Gnt.model.Dependency.Type.EndToStart, 'New dependency has correct type');
    t.isDateEqual(newTask.getStartDate(), task.getEndDate(), 'Successor start when task ends');

    newTask = new taskStore.model();
    task.addPredecessor(newTask);
    t.is(task.previousSibling, newTask, 'Predecessor added at correct position');
    t.is(task.getPredecessors()[0], newTask, 'Predecessor linked to the task');
    t.is(dependencyStore.last().getType(), Gnt.model.Dependency.Type.EndToStart, 'New dependency has correct type');
    t.isDateEqual(newTask.getEndDate(), task.getStartDate(), 'Predecessor ends when task starts');

    t.willFireNTimes(taskStore, 'update', 1);
    newTask.setStartDate(new Date());
})    
