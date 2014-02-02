Ext.define('TestApp.store.TaskStore', {
    extend  : 'Gnt.data.TaskStore',
    
    root    : {
        expanded        : true,
        loaded          : true,
        
        children        : [
            { Id : 1, leaf : true, Name : 'Task1', StartDate : new Date(2013, 10, 1), Duration : 5 },
            { Id : 2, leaf : true, Name : 'Task2', StartDate : new Date(2013, 10, 1), Duration : 5 },
            { Id : 3, leaf : true, Name : 'Task3', StartDate : new Date(2013, 10, 1), Duration : 5 }
        ]
    }
});