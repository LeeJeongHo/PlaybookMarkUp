StartTest(function(t) {
    t.diag('Setup')

    var g = t.getGantt({
        width   : undefined,
        height  : undefined
    })

    Ext.getBody().createChild({ id : 'gantt' });
    
    t.livesOk(function () {
            
        var p = Ext.create("Ext.Panel", {
            renderTo: 'gantt',
            autoWidth : true,
            autoHeight : true,
            layout  : 'fit',
            items   : [
                g
            ]
        });
        t.pass("Rendering completed")
        
        p.destroy();
        t.pass("Destroy completed")
            
    }, 'autoWidth rendering ok')
})    
