StartTest(function(t) {
    
    t.diag('Setup')
    
    var dependencyStore = Ext.create("Gnt.data.DependencyStore");
    
    var taskStore = Ext.create("Gnt.data.TaskStore", {
        autoSync    : true,
        dependencyStore : dependencyStore,
        batchSync   : false,

        proxy       : {
            type    : 'ajax',
            
            api     : {
                create  : 'data/crud/create-tasks.aspx',
                update  : 'foo',    // irrelevant
                read    : 'data/crud/get-tasks.aspx'
            },
            reader  : {
                type    : 'json'
            },
            writer : {
                writeAllFields : false
            }
        },
        
        root        : {
            loaded      : true,
            expanded    : true
        }
    });
    
    t.loadStoresAndThen(taskStore, function() {
        var root = taskStore.getRootNode();

        t.willFireNTimes(taskStore, 'beforesync', 2);

        // 1 write for creating the parent task, 1 write to create the child task
        t.willFireNTimes(taskStore, 'write', 2);
       
        var newParent = new Gnt.model.Task({ leaf : false });
        var newChild = new Gnt.model.Task({ leaf : true });

        taskStore.on('beforesync', function(hash) {
            t.is(hash.create.length, 1, 'Only 1 item found in "create" array');
            t.is(hash.create[0], newParent, 'Should find parent in "create" array');

            taskStore.getProxy().api.create = 'data/crud/create-tasks3.aspx';

            taskStore.on('beforesync', function(hash) {
                t.is(hash.create.length, 1, 'Only 1 items found in "create" array');
                t.is(hash.create[0], newChild, 'New child can now be persisted');
            }, null, { single : true });

        }, null, { single : true });

        newParent.appendChild(newChild);
        root.appendChild(newParent);
    });
})    
