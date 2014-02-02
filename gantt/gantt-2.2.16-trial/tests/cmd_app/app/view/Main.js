Ext.define('TestApp.view.Main', {
    extend: 'Ext.container.Container',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'Gnt.panel.Gantt',
        'Gnt.column.Name'
    ],
    
    xtype: 'app-main',

    layout: {
        type: 'border'
    },

    items: [{
        region: 'west',
        xtype: 'panel',
        title: 'west',
        width: 150
    },{
        region              : 'center',
        xtype               : 'ganttpanel',
        
        taskStore           : 'TaskStore',
        dependencyStore     : 'DependencyStore',
        
        startDate           : new Date(2013, 10, 1), 
        endDate             : new Date(2013, 11, 1),
        
        columns             : [
            { xtype     : 'namecolumn' }
        ]
    }]
});