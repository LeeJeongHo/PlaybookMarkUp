Ext.define("App.model.Task", {
    extend: "Gnt.model.Task",

    // Some custom field definitions
    fields: [
        { name: 'Id', type: 'int', useNull: true },
        { name: 'StartDate', type: 'date', dateFormat: 'MS', serialize : function(date) { return date; } },
        { name: 'EndDate', type: 'date', dateFormat: 'MS', serialize : function(date) { return date; } },
        { name: 'Priority', defaultValue: 1 },

    // NodeInterface overrides
        {name: 'parentId', type: 'int', useNull: true, persist: true },
        {name: 'index', type: 'int', persist: true }
    ]
});
