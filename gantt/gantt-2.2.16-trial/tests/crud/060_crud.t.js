StartTest(function(t) {
    
    t.diag('Setup')
    
    var dependencyStore = Ext.create("Gnt.data.DependencyStore");
    
    var taskStore = Ext.create("Gnt.data.TaskStore", {
        dependencyStore : dependencyStore,
        autoSync    : false,
        autoLoad    : false,
        
        proxy       : {
            type    : 'ajax',
            
            api     : {
                create  : 'data/crud/create-tasks.aspx',
                read    : 'data/crud/get-tasks.aspx',
                update  : 'data/crud/update-tasks.aspx',
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
    
    var originalData, originalData1, originalData2, originalData3;
    
    t.willFireNTimes(taskStore, 'write', 3); 
    taskStore.load();
    
    t.chain(
        { waitFor : 'storesToLoad', args : taskStore }, 
        
        function (next) {
            t.is(taskStore.getRootNode().childNodes.length,  5, '5 top-level tasks ')
            t.ok(!taskStore.getById(122), 'No new record yet')
        
            taskStore.getRootNode().appendChild({
                StartDate       : new Date(2010,1,22),
                EndDate         : new Date(2010,1,23),
                Name            : 'New task',
                Duration        : 1,
                DurationUnit    : "d",
                leaf            : true
            })
        
            t.is(taskStore.getNewRecords().length, 1, '1 records has been added')
            
            t.is(taskStore.getNewRecords()[0].data.parentId, null, 'New record has null as parentId');
        
            // can't use Ext.clone because in IE8 it also clones the non-enumerable properties like "constructor /  toString / valueOf" etc
            originalData = Ext.apply({ Id : 122 }, taskStore.getNewRecords()[0].data);
        
            t.ok(originalData.isLast, 'New record is last')
        
            // CREATE listener
            taskStore.on('write', next, null, { single : true });
            
            taskStore.sync()
            t.diag("Sync (ADD) operation started");
        },

        function (next, store, operation) {
            
            t.is(operation.action, 'create', 'Create operation completed')
            t.is(operation.getRecords().length, 1, 'A single record was created')
            
            t.ok(taskStore.getById(122), 'New record appeared')
            t.is(taskStore.getModifiedRecords().length, 0, 'No records are dirty after create');
            
            // Id should not be part of original data, add it to be able to easily compare both objects
            originalData.Id = operation.getRecords()[0].get('Id');
            
            t.is(taskStore.getById(122).data.parentId, null, 'parentId should be null for top level tasks');
            t.isDeeply(originalData, taskStore.getById(122).data, 'Created task data intact');
            
            t.diag("Now doing the UPDATE operation");
            taskStore.getById(119).setStartDate(new Date(2010, 1, 8));
            taskStore.getById(120).setStartDate(new Date(2010, 1, 8));
            taskStore.getById(121).setStartDate(new Date(2010, 1, 8));
            
            t.is(taskStore.getUpdatedRecords().length, 3, '3 records has been updated')
            
            // can't use Ext.clone because in IE8 it also clones the non-enumerable properties like "constructor /  toString / valueOf" etc
            originalData1 = Ext.apply({}, taskStore.getUpdatedRecords()[0].data),
            originalData2 = Ext.apply({}, taskStore.getUpdatedRecords()[1].data),
            originalData3 = Ext.apply({}, taskStore.getUpdatedRecords()[2].data);
                
            taskStore.on('write', next, null, { single : true });

            t.diag("Sync (UPDATE) operation started");
            taskStore.sync()
        },
                        
        function (next, store, operation) {
            t.is(operation.action, 'update', 'Correct operation completed (update)')
            t.is(operation.getRecords().length, 3, '3 records were updated')
                
            t.isDeeply(taskStore.getById(originalData1.Id).data, originalData1, 'First task data intact');
            t.isDeeply(taskStore.getById(originalData2.Id).data, originalData2, 'Second data intact');
            t.isDeeply(taskStore.getById(originalData3.Id).data, originalData3, 'Third data intact');
            t.is(taskStore.getModifiedRecords().length, 0, 'No records are dirty after update');
                
            taskStore.getById(122).remove();
            t.notOk(taskStore.getById(122), 'Should not find record after removing it');

            t.is(taskStore.getUpdatedRecords().length, 0, '0 records are modified after update');

            // DESTROY listener
            taskStore.on('write', next, null, { single : true })
                
            t.diag("Sync (REMOVE) operation started");
            taskStore.sync()
        },

        function (next, store, operation) {
            t.is(operation.action, 'destroy', 'Correct operation completed')
            t.notOk(taskStore.getById(122), 'Records no longer in store')
        }
    );
})    
