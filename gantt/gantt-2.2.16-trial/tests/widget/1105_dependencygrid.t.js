StartTest(function (t) {

    var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        data : [
            {
                From : 3,
                To   : 4,
                Type : 2
            },
            {
                From : 4,
                To   : 2,
                Type : 1
            },
            {
                From : 1,
                To   : 2,
                Type : 2
            },
            {
                From : 5,
                To   : 3,
                Type : 2
            }
        ]
    });

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        dependencyStore : dependencyStore,
        root            : {
            expanded : true,
            children : [
                {
                    Id        : 1,
                    Name      : 'Task 1',
                    StartDate : new Date(2011, 6, 1),
                    EndDate   : new Date(2011, 6, 5),
                    leaf      : true
                },
                {
                    Id        : 3,
                    Name      : 'Task 3',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 1),
                    EndDate   : new Date(2011, 6, 5)
                },
                {
                    Id        : 4,
                    Name      : 'Task 4',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 1),
                    EndDate   : new Date(2011, 6, 5)
                },
                {
                    Id        : 2,
                    Name      : 'Task 2',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 5),
                    EndDate   : new Date(2011, 6, 20)
                },
                {
                    Id        : 5,
                    Name      : 'Task 5<img id=zxcvbn>',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 5),
                    EndDate   : new Date(2011, 6, 20)
                },
                {
                    Id        : 6,
                    Name      : 'Task 6<img id=qwerty>',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 5),
                    EndDate   : new Date(2011, 6, 20)
                }
            ]
        }
    });

    taskStore.refreshNodeStoreContent(true);

    var task = taskStore.getById(2);

    var grid = new Gnt.widget.DependencyGrid({
        renderTo        : Ext.getBody(),
        width           : 400,
        title           : task.getName(),
        dependencyStore : dependencyStore,
        task            : task,
        taskModel       : taskStore.model
    });

    var selModel = grid.getSelectionModel();
    var editor, record;

    t.is(selModel.getCount(), 0, 'Grid: No rows are selected');

    t.is(grid.direction, 'predecessors', 'Grid: direction = "predecessors"');

    t.diag('Initially dependencies of Task 2 loaded');

    t.is(grid.task.get('Id'), 2, 'Grid: task Id = 2');

    t.is(grid.store.getCount(), 2, 'Grid: 2 dependencies displayed');

    t.chain(
        {
            waitFor : 'RowsVisible', args : grid
        },

        function (next) {
            t.is(grid.store.getCount(), grid.getView().getNodes().length, 'Rendered all data in store ok');
            t.matchGridCellContent(grid, 0, 0, 4, 'Found 4 in [0,0] cell');
            t.matchGridCellContent(grid, 0, 1, 'Task 4', 'Found "Task 4" in [0,1] cell');

            t.matchGridCellContent(grid, 1, 0, 1, 'Found 1 in [1,0] cell');
            t.matchGridCellContent(grid, 1, 1, 'Task 1', 'Found "Task 1" in [1,1] cell');

            next();
        },

        // start editing of task column
        function (next) {
            grid.cellEditing.startEditByPosition({ row : 0, column : 1 });

            next();
        },
        {
            waitFor : 'componentVisible',
            args    : [ 'combobox' ]
        },
        // let`s open picker
        {
            action : 'click',
            target : function () {
                editor = grid.cellEditing.getActiveEditor();
                return editor.field.el.down('.x-form-trigger');
            }
        },
        function (next) {
            var selected = editor.field.getPicker().el.down('.x-boundlist-item.x-boundlist-selected').dom;
            selected = selected.innerText || selected.textContent;

            t.is(selected, 'Task 4', 'Picker highlighted proper item "Task 4"');

            t.notOk(document.getElementById('zxcvbn'), 'Combobox escapes HTML characters');

            next();
        },

        // test dependency adding
        function (next) {
            t.diag('Test dependency adding');
            record = grid.insertDependency()[0];
            t.waitForComponentVisible('combobox', next);
        },

        // new record should be first at store
        function (next) {
            t.ok(grid.store.getAt(0) === record, 'Added record is first at grid store');

            t.is(record.get(record.typeField), 2, 'Type=2 (End-to-Start)');
            t.is(record.get(record.lagField), 0, 'Lag=0');
            t.is(record.get(record.lagUnitField), 'd', 'LagUnit="d"');

            next();
        },

        // type "Task 3" to combo
        function (next) {
            t.diag('Lest`s type string "Task 3" to task combo');
            editor = grid.cellEditing.getActiveEditor();
            editor.field.inputEl.dom.value = 'Task 3';

            grid.cellEditing.completeEdit();

            next();
        },
        function (next) {
            t.is(editor.field.getValue(), 3, 'Proper value set');
            t.notOk(record.isValid(), 'Field marked as invalid');
            var cell = grid.getView().getCellByPosition({ row : 0, column : 1 });
            t.is(cell.getAttribute('data-errorqtip'), grid.l10n.transitiveDependencyText, 'Transitive dependency detected');

            next();
        },


        {
            action : 'click',
            target : function () {
                return grid.getView().getCellByPosition({ row : 0, column : 1 });
            }
        },
        function (next) {
            grid.cellEditing.startEditByPosition({ row : 0, column : 1 });
            t.waitForComponentVisible('combobox', next);
        },
        function (next) {
            t.diag('Lest`s type string "Task 1" to task combo1');
            editor = grid.cellEditing.getActiveEditor();
            editor.field.inputEl.dom.value = '';
            t.type(editor.field, 'Task 1', next);
        },
        function (next) {
            grid.cellEditing.completeEdit();

            t.is(editor.field.getValue(), 1, 'Proper value set');
            t.notOk(record.isValid(), 'Field marked as invalid');
            var cell = grid.getView().getCellByPosition({ row : 0, column : 1 });
            t.is(cell.getAttribute('data-errorqtip'), grid.l10n.duplicatingDependencyText, 'Duplicating dependency detected');

            next();
        },

        // check grid.saveDependencies() to not save invalid records
        function (next) {
            t.diag('Check if grid.saveDependencies() will save invalid records');
            grid.saveDependencies();
            t.is(dependencyStore.getCount(), 4, 'dependencyStore number of records didn`t change (invalid field didn`t get to dependencyStore)');

            next();
        },

        {
            action : 'click',
            target : function () {
                return grid.getView().getCellByPosition({ row : 0, column : 1 });
            }
        },
        function (next) {
            grid.cellEditing.startEditByPosition({ row : 0, column : 1 });
            t.waitForComponentVisible('combobox', next);
        },
        function (next) {
            t.diag('Lest`s type string "Task 6&lt;img id=qwerty&gt;" to task combo');
            editor = grid.cellEditing.getActiveEditor();
            editor.field.inputEl.dom.value = '';
            t.type(editor.field, 'Task 6<img id=qwerty>', next);
        },
        function (next) {
            grid.cellEditing.completeEdit();

            t.notOk(document.getElementById('qwerty'), 'Grid escapes HTML characters');

            t.is(editor.field.getValue(), 6, 'Proper value set');
            t.ok(record.isValid(), 'Field marked as valid');
            var cell = grid.getView().getCellByPosition({ row : 0, column : 1 });
            t.ok(!cell.getAttribute('data-errorqtip'), 'No error tooltip');

            next();
        },

        // check grid.saveDependencies() to save added record
        function (next) {
            t.diag('Check if grid.saveDependencies() will save added record');
            grid.saveDependencies();
            t.is(dependencyStore.getCount(), 5, 'dependencyStore number of records increased');
            t.ok(!!dependencyStore.getByTaskIds(6, 2), 'dependencyStore has added record');

            next();
        },

        // check grid.saveDependencies() to not save added record again
        function (next) {
            t.diag('Check if grid.saveDependencies() will save added record again');
            grid.saveDependencies();
            t.is(dependencyStore.getCount(), 5, 'dependencyStore number of records didn`t change');

            next();
        },

        // we gonna load task by task
        // and then : 1) check grid.task property; 2) check grid rows number

        // switch to task #1
        function (next) {
            t.diag('Load task 1 dependencies');
            task = taskStore.getById(1);
            grid.loadDependencies(task);
            // set grid title ..just for nice look
            grid.setTitle(task.getName());

            t.is(grid.task.get('Id'), 1, 'Grid: task Id = 1');

            t.is(grid.store.getCount(), 0, 'Grid: no dependencies displayed');
            t.is(grid.store.getCount(), grid.getView().getNodes().length, 'Rendered all data in store ok');

            next();
        },
        // switch to task #3
        function (next) {
            t.diag('Load task 3 dependencies');
            task = taskStore.getById(3);
            grid.loadDependencies(task);
            // set grid title ..just for nice look
            grid.setTitle(task.getName());

            t.is(grid.task.get('Id'), 3, 'Grid: task Id = 3');

            t.is(grid.store.getCount(), 1, 'Grid: 1 dependency displayed');
            t.is(grid.store.getCount(), grid.getView().getNodes().length, 'Rendered all data in store ok');

            next();
        },
        // switch to task #4
        function (next) {
            t.diag('Load task 4 dependencies');
            task = taskStore.getById(4);
            grid.loadDependencies(task);
            // set grid title ..just for nice look
            grid.setTitle(task.getName());

            t.is(grid.task.get('Id'), 4, 'Grid: task Id = 4');

            t.is(grid.store.getCount(), 1, 'Grid: 1 dependency displayed');
            t.is(grid.store.getCount(), grid.getView().getNodes().length, 'Rendered all data in store ok');

            t.matchGridCellContent(grid, 0, 0, 3, 'Found 3 in [0,0] cell');
            t.matchGridCellContent(grid, 0, 1, 'Task 3', 'Found "Task 3" in [0,1] cell');

            next();
        },

        // start editing of task column
        function (next) {
            grid.cellEditing.startEditByPosition({row : 0, column : 1});

            next();
        },
        {
            waitFor : 'componentVisible',
            args    : [ 'combobox' ]
        },
        // type "smth" to input element
        function (next) {
            t.diag('Lest`s type invalid string "smth" to task combo');
            editor = grid.cellEditing.getActiveEditor();
            editor.field.inputEl.dom.value = 'smth';
            // imitate blur event on the field it should validate value
            // in the picker and not change value in the field
            editor.field.triggerBlur();

            next();
        },
        function (next) {
            t.is(editor.field.getValue(), 3, 'Editor value still keeps 3');

            next();
        }

    );
});
