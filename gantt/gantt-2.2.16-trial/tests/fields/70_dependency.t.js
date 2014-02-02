StartTest(function(t) {

    var taskStore = t.getTaskStore({
        DATA            : [
            {
                Id : 11
            },
            {
                Id : 12
            },
            {
                Id : 13
            }
        ],
        dependencyStore : new Gnt.data.DependencyStore()
    });

    var root  = taskStore.getRootNode(),
        task  = root.firstChild,
        task2 = task.nextSibling,
        task3 = root.lastChild;
        
    var field      = new Gnt.field.Dependency({
        task                : task,
        fieldLabel          : 'Dep Field',
        renderTo            : Ext.getBody()
    });

    t.diag('Dependency field tests');

    t.chain(
        {
            action      : 'click',
            target      : '.x-form-field'
        },
        function (next) {
            t.diag('Search by ID');
            field.setValue('12');

            // This should process the field content and update the dependency store
            field.applyChanges();

            t.is(taskStore.dependencyStore.getCount(), 1, 'Should find 1 new record in the dependency store');
            t.is(taskStore.dependencyStore.first().getSourceTask(), task2, 'Should find task2 as source task');
            t.is(taskStore.dependencyStore.first().getTargetTask(), task, 'Should find task1 as target task');

            field.setValue();

            // This should clear the dependency store contents
            field.applyChanges();
            t.is(taskStore.dependencyStore.getCount(), 0, 'Should find no records in the dependency store with an empty field');
            next();
        },
        {
            action      : 'click',
            target      : '.x-form-field'
        },
        function (next) {
            t.diag('Search by sequence number');
            field.useSequenceNumber = true;
            field.setValue('3');

            // This should process the field content and update the dependency store
            field.applyChanges();

            t.is(taskStore.dependencyStore.getCount(), 1, 'Should find 1 new record in the dependency store');
            t.is(taskStore.dependencyStore.first().getSourceTask(), task3, 'Should find task3 as source task');
            t.is(taskStore.dependencyStore.first().getTargetTask(), task, 'Should find task1 as target task');

            field.setValue();

            // This should clear the dependency store contents
            field.applyChanges();
            t.is(taskStore.dependencyStore.getCount(), 0, 'Should find no records in the dependency store with an empty field');
            next();
        }
    );
});
