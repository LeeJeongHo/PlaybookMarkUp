StartTest(function(t) {
    
    t.diag('Adding a successor with autoSync should cause one sync call (two writes)')
    
    var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        proxy       : {
            type    : 'ajax',
            
            api     : {
                create  : 'foo'
            },
            reader  : {
                type    : 'json'
            }
        }
    });
    
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
        var leaf = first.lastChild;
        t.ok(leaf.isLeaf(), 'Task is a leaf');

        var writes = 0;

        taskStore.on('write', function() { writes++; });

        t.waitFor(
            function() { return writes === 2; },
            evaluate
        );

        t.willFireNTimes(taskStore, 'beforesync', 2);

        leaf.addSuccessor(new Gnt.model.Task({ Name : 'Foo' }));

        function evaluate() {
            t.is(first.childNodes.length, nbrChildren+1, '1 child node added');
                
            t.is(dependencyStore.getCount(), 1, '1 record added to dependency store');

            t.is(first.childNodes.length, nbrChildren+1, '1 child node added');
                
            // Server responds 'New task' => name
            t.is(first.lastChild.get('Name'), 'New task', 'New node has correct name');
            t.ok(first.lastChild.isLeaf(), 'New node is a leaf');

            t.is(dependencyStore.first().getTargetId(), 122, 'New task Id was applied to phantom dependency');

            taskStore.cascadeChanges = true;

            leaf.setEndDate(new Date(2020, 0, 1));
            t.is(writes, 2, '2 sync calls made for multiple update after an edit (cascade and recalculated parent)');
        }
    });
})    
