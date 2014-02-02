StartTest(function(t) {
    t.it("Nested beginEdit/endEdit should work", function (t) {
        var t1 = t.getTaskStore().getRootNode().firstChild;
    
        t1.beginEdit();
        t1.beginEdit();
        t1.endEdit();
        t1.endEdit();
    })
    
    t.it("`update` event should not be fired when dirty record is modified w/o changes", function (t) {
        var taskStore       = t.getTaskStore()
        var t1              = taskStore.getRootNode().firstChild;
    
        t.firesOk(taskStore, 'update', 1, 'Should fire 1 `update` event')
        
        taskStore.on('update', function (store, record) {
            t.ok(record.dirty, "Task is dirty in the `update` event listener")
        })
        
        t1.beginEdit();
        t1.setName("New Name");
        t1.endEdit();
        
        t.ok(t1.dirty, "Record became dirty")
        
        t.wontFire(taskStore, 'update', "`update` event should not be fired")
        
        t1.beginEdit();
        t1.setDurationUnit(t1.getDurationUnit())
        t1.endEdit();
    })
    
    t.it("Dirty flag should be kept in case of nested beginEdit/endEdit", function (t) {
        var taskStore       = t.getTaskStore()
        var t1              = taskStore.getRootNode().firstChild;
    
        t1.beginEdit();
        t1.beginEdit();
        t1.setName("New Name");
        t.ok(t1.dirty, "Record became dirty")
        t1.endEdit();
        t1.endEdit();
        
        t.ok(t1.dirty, "Record became dirty")
    })
    
});  
