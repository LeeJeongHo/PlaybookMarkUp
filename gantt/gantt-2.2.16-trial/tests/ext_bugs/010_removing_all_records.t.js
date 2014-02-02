StartTest(function(t) {

    t.diag('Setup');

    var taskStore = new Gnt.data.TaskStore({
        proxy       : {
            type    : 'memory',
            reader  : {
                type    : 'json'
            }
        },     
        dependencyStore : null
    });

    t.todo("Removing all records", function(t){

        taskStore.load();

        taskStore.removeAll();
        t.is(taskStore.getRootNode(), undefined, 'All records removed including rootNode');
    });
});  
