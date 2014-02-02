StartTest(function (t) {

    /* Here we check the validation of cyclic dependencies like this:
        (T1 is a child of P1):

        P1 =========
        T1 ++++++       P2 ==========
                        T2    ++++       P3 =====
                                         T3 +++++


        Scenario #1: P1---->P2
        -- Set : T2---->P1

        Scenario #2: P1---->T2
        -- Set : T2---->T1

        Scenario #3: P1---->P2
        -- Set : T2---->T1

        Scenario #4: P1---->P2---->P3
        -- Set : T3---->T1

        Scenario #5: P1---->T2
        -- Set : P2---->T1

        Scenario #6: P1---->T2 P2---->T3
        -- Set : P3---->T1

        Scenario #7: T1---->P2 T2---->P3
        -- Set : T3---->P1

        Scenario #8: T1---->P2 T2---->P3
        -- Set : T4---->P1

        Scenario #9: T1---->P2 T4---->P1
        -- Set : T2---->P3

        Scenario #10: T4---->P1 T1---->P2
        -- Set : T2---->T3

        Scenario #11: P1---->P2 T2---->T3
        -- Set : P3---->P1

        Scenario #12: P1---->P2 T2---->T3
        -- Set : P3---->T1
    */

    var dependencyStore, taskStore;

    var getData = function (dependencies) {

        dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            data    : dependencies || [{ From: 'P1', To: 'P2' }],
            strictDependencyValidation : true
        });

        taskStore = Ext.create("Gnt.data.TaskStore", {
            dependencyStore: dependencyStore,

            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },

            root: {
                expanded: true,

                children: [
                    {
                        leaf: false,
                        Id: 'P1',
                        children: [
                            {
                                Id: 'T1',
                                leaf: true
                            }
                        ]
                    },
                    {
                        leaf: false,
                        Id: 'P2',
                        children: [
                            {
                                Id: 'T2',
                                leaf: true
                            }
                        ]
                    },
                    {
                        leaf: false,
                        Id: 'P3',
                        children: [
                            {
                                Id: 'T3',
                                leaf: true
                            },
                            {
                                Id: 'T3.1',
                                leaf: false,
                                children: [
                                    {
                                        Id: 'T4',
                                        leaf: true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    };

    var getData2 = function (dependencies) {

        dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            data    : dependencies || [{ From: 'P1', To: 'P2' }],
            strictDependencyValidation : true
        });

        taskStore = Ext.create("Gnt.data.TaskStore", {
            dependencyStore: dependencyStore,

            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },

            root: {
                expanded: true,

                children: [
                    {
                        leaf: false,
                        Id: 'A1',
                        children: [
                            {
                                leaf: false,
                                Id: 'P1',
                                children: [
                                    {
                                        Id: 'T1',
                                        leaf: true
                                    }
                                ]
                            },
                            {
                                leaf: false,
                                Id: 'P2',
                                children: [
                                    {
                                        Id: 'T2',
                                        leaf: true
                                    }
                                ]
                            },
                            {
                                leaf: false,
                                Id: 'P3',
                                children: [
                                    {
                                        Id: 'T3',
                                        leaf: true
                                    },
                                    {
                                        Id: 'T3.1',
                                        leaf: false,
                                        children: [
                                            {
                                                Id: 'T4',
                                                leaf: true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    };

    t.it('Validates correctly for scenario #1', function (t) {
        getData();

        t.notOk(dependencyStore.isValidDependency('T2', 'P1'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #2', function (t) {
        getData([{ From: 'P1', To: 'T2' }]);

        t.notOk(dependencyStore.isValidDependency('T2', 'T1'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #3', function (t) {
        getData();

        t.notOk(dependencyStore.isValidDependency('T2', 'T1'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #4', function (t) {
        getData([{ From: 'P1', To: 'P2' }, { From: 'P2', To: 'P3' }]);

        t.notOk(dependencyStore.isValidDependency('T3', 'T1'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #5', function (t) {
        getData([{ From: 'P1', To: 'T2' }]);

        t.notOk(dependencyStore.isValidDependency('P2', 'T1'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #6', function (t) {
        getData([{ From: 'P1', To: 'T2' }, { From: 'P2', To: 'T3' }]);

        t.notOk(dependencyStore.isValidDependency('P3', 'T1'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #7', function (t) {
        getData([{ From: 'T1', To: 'P2' }, { From: 'T2', To: 'P3' }]);

        t.notOk(dependencyStore.isValidDependency('T3', 'P1'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #8', function (t) {
        getData([{ From: 'T1', To: 'P2' }, { From: 'T2', To: 'P3' }]);

        t.notOk(dependencyStore.isValidDependency('T4', 'P1'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #9', function (t) {
        getData([{ From: 'T1', To: 'P2' }, { From: 'T4', To: 'P1' }]);

        t.notOk(dependencyStore.isValidDependency('T2', 'P3'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #10', function (t) {
        getData([{ From: 'T4', To: 'P1' }, { From: 'T1', To: 'P2' }]);

        t.notOk(dependencyStore.isValidDependency('T2', 'T3'), 'correctly detects cycle');
    });

    t.it('Validates correctly some valid dependencies', function (t) {
        getData();

        t.ok(dependencyStore.isValidDependency('P2', 'P3'), 'valid dependency');
        t.ok(dependencyStore.isValidDependency('P2', 'T3'), 'valid dependency');
    });

    t.it('Validates correctly for scenario #1 (having common group P3)', function (t) {

        getData([{ From: 'T3', To: 'T3.1' }, { From: 'T4', To: 'T3' }]);

        t.notOk(dependencyStore.isValidDependency('T4', 'T3'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #11', function (t) {
        getData([{ From: 'P1', To: 'P2' }, { From: 'T2', To: 'T3' }]);

        t.notOk(dependencyStore.isValidDependency('P3', 'P1'), 'correctly detects cycle');
    });

    t.it('Validates correctly for scenario #12', function (t) {
        getData([{ From: 'P1', To: 'P2' }, { From: 'T2', To: 'T3' }]);

        t.notOk(dependencyStore.isValidDependency('P3', 'T1'), 'correctly detects cycle');
    });


    t.it('All above scenarios but tasks are enclosed by a single super-group A1', function (t) {
        t.it('Validates correctly for scenario #1', function (t) {
            getData2();

            t.notOk(dependencyStore.isValidDependency('T2', 'P1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #2', function (t) {
            getData2([{ From: 'P1', To: 'T2' }]);

            t.notOk(dependencyStore.isValidDependency('T2', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #3', function (t) {
            getData2();

            t.notOk(dependencyStore.isValidDependency('T2', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #4', function (t) {
            getData2([{ From: 'P1', To: 'P2' }, { From: 'P2', To: 'P3' }]);

            t.notOk(dependencyStore.isValidDependency('T3', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #5', function (t) {
            getData2([{ From: 'P1', To: 'T2' }]);

            t.notOk(dependencyStore.isValidDependency('P2', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #6', function (t) {
            getData2([{ From: 'P1', To: 'T2' }, { From: 'P2', To: 'T3' }]);

            t.notOk(dependencyStore.isValidDependency('P3', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #7', function (t) {
            getData2([{ From: 'T1', To: 'P2' }, { From: 'T2', To: 'P3' }]);

            t.notOk(dependencyStore.isValidDependency('T3', 'P1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #8', function (t) {
            getData2([{ From: 'T1', To: 'P2' }, { From: 'T2', To: 'P3' }]);

            t.notOk(dependencyStore.isValidDependency('T4', 'P1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #9', function (t) {
            getData2([{ From: 'T1', To: 'P2' }, { From: 'T4', To: 'P1' }]);

            t.notOk(dependencyStore.isValidDependency('T2', 'P3'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #10', function (t) {
            getData2([{ From: 'T4', To: 'P1' }, { From: 'T1', To: 'P2' }]);

            t.notOk(dependencyStore.isValidDependency('T2', 'T3'), 'correctly detects cycle');
        });

        t.it('Validates correctly some valid dependencies', function (t) {
            getData2();

            t.ok(dependencyStore.isValidDependency('P2', 'P3'), 'valid dependency');
            t.ok(dependencyStore.isValidDependency('P2', 'T3'), 'valid dependency');
        });

        t.it('Validates correctly for scenario #1 (having common group P3)', function (t) {

            getData2([{ From: 'T3', To: 'T3.1' }, { From: 'T4', To: 'T3' }]);

            t.notOk(dependencyStore.isValidDependency('T4', 'T3'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #11', function (t) {
            getData([{ From: 'P1', To: 'P2' }, { From: 'T2', To: 'T3' }]);

            t.notOk(dependencyStore.isValidDependency('P3', 'P1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #12', function (t) {
            getData([{ From: 'P1', To: 'P2' }, { From: 'T2', To: 'T3' }]);

            t.notOk(dependencyStore.isValidDependency('P3', 'T1'), 'correctly detects cycle');
        });
    });
});
