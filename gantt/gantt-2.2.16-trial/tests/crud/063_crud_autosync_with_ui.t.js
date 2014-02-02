StartTest(function(t) {
    
    t.diag('Setup')
    
    var dependencyStore = Ext.create("Gnt.data.DependencyStore");
    
    var taskStore = Ext.create("Gnt.data.TaskStore", {
        autoSync    : true,
        autoLoad    : false,
        
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
    
    t.getGantt({
        dependencyStore : dependencyStore,
        taskStore : taskStore,
        renderTo : Ext.getBody()
    });

    var originalData;
    
    t.chain(
        function(next) {
            t.loadStoresAndThen(taskStore, next);
        },

        function(next) {

            t.is(taskStore.getRootNode().childNodes.length,  5, '5 top-level tasks ')
            t.ok(!taskStore.getById(122), 'No new record yet')
        
            // CREATE listener
            taskStore.on('write', next, null, { single : true });

            taskStore.getRootNode().appendChild({
                StartDate       : new Date(2010,1,22),
                EndDate         : new Date(2010,1,23),
                Name            : 'New task',
                Duration        : 1,
                DurationUnit    : "d",
                leaf            : true
            })
            t.diag("Sync (ADD) operation started");

            // can't use Ext.clone because in IE8 it also clones the non-enumerable properties like "constructor /  toString / valueOf" etc
            originalData = Ext.apply({ Id : 122 }, taskStore.getNewRecords()[0].data);
        
            t.ok(originalData.isLast, 'New record is last')
        
            t.is(taskStore.getNewRecords().length, 1, '1 records has been added')
        },
        
        function (next, store, operation) {
            
            t.is(operation.action, 'create', 'Correct operation completed')
            t.is(operation.getRecords().length, 1, 'A single record was created')
            
            t.ok(taskStore.getById(122), 'New record appeared')
            
            // Id should not be part of original data, add it to be able to easily compare both objects
            originalData.Id = operation.getRecords()[0].get('Id');
            t.isDeeply(originalData, taskStore.getById(122).data, 'Created task data intact');
            
            taskStore.on('write', next, null, { single : true }); 
            
            t.diag("Sync (UPDATE) operation started");
            taskStore.getById(122).setStartDate(new Date(2010, 1, 8));
            
            t.is(taskStore.getUpdatedRecords().length, 1, '1 records has been updated')
            
            // can't use Ext.clone because in IE8 it also clones the non-enumerable properties like "constructor /  toString / valueOf" etc
            originalData = Ext.apply({}, taskStore.getUpdatedRecords()[0].data);
        },
        
        function (next, store, operation) {
            
            t.is(operation.action, 'update', '"update" operation completed')
            t.is(operation.getRecords().length, 1, '1 records were updated')
                
            t.isDeeply(taskStore.getById(originalData.Id).data, originalData, 'First task data intact');
                
            taskStore.on('write', next, null, { single : true })
            taskStore.getById(122).remove();
            t.diag("Sync (REMOVE) operation started");
        },

        function (next, store, operation) {
            t.is(operation.action, 'destroy', '"destroy" operation completed')
            t.notOk(taskStore.getById(122), 'Records no longer in store')
        }
    );
})    
