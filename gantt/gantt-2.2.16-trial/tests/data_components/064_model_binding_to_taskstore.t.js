StartTest(function(t) {

    // This test covers these overrides in TaskModel, afterEdit, afterReject, afterCommit

    var ts = Ext.create('Ext.data.TreeStore', {
        fields : ['foo'],
        root : {
            loaded : true,
            expanded : true
        }
    });

    var newParent = new Gnt.model.Task({ leaf : false });
    var newChild = new Gnt.model.Task({ leaf : true });

    newParent.appendChild(newChild);
    ts.getRootNode().appendChild(newParent);

    t.isGreater(newParent.stores.length, 0, 'Parent model added should be bound to a store');

    // http://www.sencha.com/forum/showthread.php?180406-4.1B2-TreeStore-inconsistent-firing-of-update
    t.knownBugIn('4.2.2.1144', function (t) {
        t.isGreater(newChild.stores.length, 0, 'Leaf Model of a collapsed parent should be bound to a store');
    })
})
