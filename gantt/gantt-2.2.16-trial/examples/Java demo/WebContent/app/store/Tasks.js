Ext.define('DEMO.store.Tasks', {
    extend : 'Gnt.data.TaskStore',
    model : 'DEMO.model.Task',
    autoLoad : false,
    autoSync : true,
    
    proxy: {
        type: 'ajax',
        api: {
        	read : 'tasks/view.action',
            create : 'tasks/create.action',
            update: 'tasks/update.action',
            destroy: 'tasks/delete.action'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            encode: false,
            root: 'data'
        },
        listeners: {
            exception: function(proxy, response, operation){
            	var error = null;
            	if (!operation.getError()){
            		error = Ext.JSON.decode(response.responseText);
            		error = error.message;
            	} else {
            		error = operation.getError().statusText;
            	}
            	
                Ext.MessageBox.show({
                    title: 'REMOTE EXCEPTION',
                    msg: error,
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        }
    }
});