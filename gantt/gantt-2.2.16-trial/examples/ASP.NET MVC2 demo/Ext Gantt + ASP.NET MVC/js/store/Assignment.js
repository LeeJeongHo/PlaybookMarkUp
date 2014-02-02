Ext.define("App.store.Assignment", {
    extend : 'Gnt.data.AssignmentStore',
    autoLoad: true,

    proxy: {
        method: 'GET',
        type: 'ajax',
        api: {
            read: 'Assignments/Get',
            create: 'Assignments/Create',
            destroy: 'Assignments/Delete'
        },
        reader: {
            type: 'json',
            root: 'assignmentdata'
        },
        writer: {
            root: 'assignmentdata',
            type: 'json',
            encode: true,
            allowSingle: false
        }
    },
    listeners: {
        load: function () {
            //this.resourceStore.loadData(this.proxy.reader.jsonData.resources);
        }
    }
});