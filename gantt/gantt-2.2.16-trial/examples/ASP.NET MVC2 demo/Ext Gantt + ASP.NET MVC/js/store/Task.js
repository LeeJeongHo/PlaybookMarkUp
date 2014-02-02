Ext.define("App.store.Task", {
    extend: 'Gnt.data.TaskStore',
    model: 'App.model.Task',
    autoSync: true,
    proxy       : {
        type : 'ajax',
        api: {
            read:       'Tasks/Get',
            create:     'Tasks/Create',
            destroy:    'Tasks/Delete',
            update:     'Tasks/Update'
        },
        writer : {
            type : 'json',
            root : 'taskdata',
            encode : true,
            allowSingle : false
        },
        reader : {
            type : 'json'
        }
    },
    listeners : {
        beforesync : function() {
        }
    }
});
        