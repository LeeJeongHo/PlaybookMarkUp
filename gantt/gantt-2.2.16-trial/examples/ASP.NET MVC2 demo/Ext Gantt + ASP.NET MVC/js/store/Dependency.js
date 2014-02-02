Ext.define("App.store.Dependency", {
    extend : 'Gnt.data.DependencyStore',
    autoLoad : true,
    autoSync : true,
    proxy: {
        type : 'ajax',
        url: 'dependencies.js',
        method: 'GET',
        reader: {
            root: 'dependencydata',
            type : 'json'
        },
        writer : {
            root: 'dependencydata',
            type : 'json',
            encode : true,
            allowSingle : false
        },
        api: {
            read : 'Dependencies/Get',
            create: 'Dependencies/Create',
            destroy: 'Dependencies/Delete'
        }
    }
});
