StartTest(function(t) {
    
    t.diag('Setup')
    
    var dependencyStore = Ext.create("Gnt.data.DependencyStore");
    
    var taskStore = Ext.create("Gnt.data.TaskStore", {
        autoSync    : true,
        dependencyStore : dependencyStore,

        proxy       : {
            type    : 'ajax',
            
            api     : {
                create  : 'data/crud/create-tasks.aspx',
                read    : 'data/crud/get-tasks.aspx',
                update  : 'data/crud/update-tasks2.aspx',
                destroy : 'data/crud/delete-tasks.aspx'
            },
            reader  : {
                type    : 'json'
            }
        },
        
        root        : {
            loaded      : true,
            expanded    : true
        }
    });
    
    t.loadStoresAndThen(taskStore, function() {
        var first = taskStore.getRootNode().firstChild;
        var nbrChildren = first.childNodes.length;
        var leaf = first.firstChild;
        t.ok(leaf.isLeaf(), 'Task is a leaf');

        t.willFireNTimes(taskStore, 'beforesync', 1);

        // 1 write for creating the successor task, 1 write to update its parent end date
        t.willFireNTimes(taskStore, 'write', 2);
        var writes = 0;

        taskStore.on('write', function() {
            writes++; 
            if (writes === 2) { evaluate(); }
        });

        leaf.addPredecessor(new Gnt.model.Task({ Name : 'Foo' }));

        function evaluate() {
            t.is(first.childNodes.length, nbrChildren+1, '1 child node added');
                
            t.is(dependencyStore.getCount(), 1, '1 record added to dependency store');

            t.is(first.childNodes.length, nbrChildren+1, '1 child node added');
                
            // Server responds 'New task' => name
            t.is(first.firstChild.get('Name'), 'New task', 'New node has correct name');
            t.ok(first.firstChild.isLeaf(), 'New node is a leaf');
        }
    });
})    
