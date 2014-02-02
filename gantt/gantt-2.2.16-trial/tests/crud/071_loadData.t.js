StartTest(function(t) {
    var dependencyStore = Ext.create("Gnt.data.DependencyStore");
    
    var taskStore = Ext.create("Gnt.data.TaskStore", {
        dependencyStore : dependencyStore,
        autoSync    : false,
        autoLoad    : false,
        calendar    : Ext.create('Gnt.data.Calendar', {}),
        
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

    var taskStore2 = Ext.create("Gnt.data.TaskStore", {
        dependencyStore : dependencyStore,
        autoSync    : true,
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
        }
    });

    //create a copy of taskStore2
    var taskStore3 = Ext.create("Gnt.data.TaskStore", {
        dependencyStore : dependencyStore,
        autoSync    : true,
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
        }
    });

    var taskStore4 = Ext.create("Gnt.data.TaskStore", {
        autoSync    : false,
        autoLoad    : false,
        //Buffered stores not yet supported
        //buffered    : true,
        proxy       : {
            type    : 'memory',
            reader  : {
                type    : 'json'
            }
        }
    });

    taskStore.load();

    var model = taskStore.model,
        root = taskStore.getRootNode(),
        countNodes = function(node, a) {
            var i = 0;

            node.cascadeBy(function(n){
                if (n !== node){
                    i++;
                    if(a) {
                        console.log(n);
                    }
                }
            });

            return i;
        },
        findNode = function(root, id){
            var node = null;

            root.cascadeBy(function(n){
                if (n.getId() === id){
                    node = n;

                    return false;
                }
            });

            return node;
        },

        data1 = [
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 201,
                "internalId": 201,
                "StartDate": "2010-01-03",
                "EndDate": "2010-01-03",
                "PercentDone": 0,
                "Name": "Parent 201",
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            }
        ],

        data2 = [
            {
                "children": null,
                "leaf": false,
                "expanded": false,
                "Id": 201,
                "internalId": 201,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent 201 Update",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            },    
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 202,
                "internalId": 202,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-03",
                "PercentDone": 0,
                "Name": "Parent 202",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 203,
                "internalId": 203,
                "StartDate": "2010-01-25",
                "EndDate": "2010-02-12",
                "PercentDone": 0,
                "Name": "Child for 201",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 201,
                "index": 0
            }        
        ],

        data2b = [
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 203,
                "internalId": 203,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child for 201",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 201,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 202,
                "internalId": 202,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent 202",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            },
            {
                "children": null,
                "leaf": false,
                "expanded": false,
                "Id": 201,
                "internalId": 201,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent 201",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            }                 
        ],        

        data3 = [
            new model({
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 204,
                "internalId": 204,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent 202",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            }),
            new model({
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 205,
                "internalId": 205,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child for 201",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 204,
                "index": 0
            }),
            new model({
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 202,
                "internalId": 202,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent 202",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            })            
        ],

        data4 = [
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 205,
                "internalId": 203,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child for 201",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 201,
                "index": 1
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-03",
                "Id": 202,
                "internalId": 202,
                "Name": "Child 202",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 201,
                "index": 0
            },            
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 203,
                "internalId": 203,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child for 202",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 202,
                "index": 0
            }         
        ],

        data5 = [
            {
                "Id": 206,
                "internalId": 206,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "Name": "Child for 202",
                "parentId": 202
            } 
        ],

        data5b = [
            {
                "Id": 206,
                "Name": "Child for 202 Updated"
            } 
        ],

        data6 = [
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 207,
                "internalId": 207,
                "Name": "Child 202",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 208
            },            
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 208,
                "internalId": 208,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child for 202",
                "parentId": 207
            }  
        ],

        data7 = [
            {
                "children": null,
                "leaf": true,
                "expanded": true,
                "Id": 209,
                "internalId": 209,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child for 201",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 201,
                "index": 9999
            } 
        ],

        data8 = [
            {
                "children": null,
                "leaf": true,
                "expanded": true,
                "Id": 210,
                "internalId": 210,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child for 203",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 203,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 203,
                "internalId": 203,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-03",
                "PercentDone": 0,
                "Name": "Parent #203",
                "Duration": 0,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            }          
        ],

        data9 = [
            {
                "children": null,
                "leaf": true,
                "expanded": true,
                "Id": 211,
                "internalId": 211,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child for 203",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 203,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 203,
                "internalId": 203,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child for 212",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 212,
                "index": 0
            },            
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 212,
                "internalId": 212,
                "Name": "Parent 212",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null
            }          
        ],

        data10 = [
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 203,
                "internalId": 203,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child of own child",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 211,
                "index": 0
            }
        ],

        data11 = [
            {
                "children": null,
                "leaf": true,
                "expanded": true,
                "Id": 211,
                "internalId": 211,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent of 203",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 203,
                "internalId": 203,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child of own child",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 211,
                "index": 0
            }                       
        ],

        data12 = [
            {
                "children": null,
                "leaf": false,
                "expanded": false,
                "Id": 213,
                "internalId": 213,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent 1",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            },    
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 214,
                "internalId": 214,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent 2",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 215,
                "internalId": 215,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child 1.1",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 213,
                "index": 0
            },        
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 216,
                "internalId": 216,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child 1.2",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 213,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 217,
                "internalId": 217,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child 1.1.1",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 215,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 218,
                "internalId": 218,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child 1.1.2",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 215,
                "index": 0
            }             
        ],

        data13 = [
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 215,
                "internalId": 215,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child 1.1 to Root",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            }            
        ],

        data14 = [
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 216,
                "internalId": 216,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child 1.2",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 213,
                "index": 0
            },        
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 215,
                "internalId": 215,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child 1.1",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 213,
                "index": 0
            },                  
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 217,
                "internalId": 217,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child 1.1.1",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 215,
                "index": 0
            },
            {
                "children": null,
                "leaf": false,
                "expanded": false,
                "Id": 213,
                "internalId": 213,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent 1",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            },              
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 218,
                "internalId": 218,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Child 1.1.2",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 215,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 214,
                "internalId": 214,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-11",
                "PercentDone": 0,
                "Name": "Parent 2",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            }                  
        ],
        data15 = [
            { 
                "EndDate" : "2010-01-28",
                "BaselineEndDate" : "2010-01-28",
                "Id" : 50,
                "internalId": 50,
                "leaf" : true,
                "Name" : "T50",
                "StartDate" : "2010-01-18",
                "BaselineStartDate" : "2010-01-20",
                "parentId" : 5,
                "index": 0
            },
            { 
                "EndDate" : "2010-02-02",
                "BaselineEndDate" : "2010-02-01",
                "Id" : 5,
                "internalId": 5,
                "leaf" : false,
                "Name" : "T5",
                "StartDate" : "2010-01-28",
                "BaselineStartDate" : "2010-01-25",
                "parentId" : 100,
                "index": 5
            },
            { 
                "EndDate" : "2010-02-02",
                "BaselineEndDate" : "2010-02-01",
                "Id" : 2,
                "internalId": 2,
                "leaf" : true,
                "Name" : "T2",
                "StartDate" : "2010-01-25",
                "BaselineStartDate" : "2010-01-25",
                "parentId" : 100,
                "index": 2
            },
            { 
                "EndDate" : "2010-02-02",
                "BaselineEndDate" : "2010-02-04",
                "Id" : 0,
                "internalId": 0,
                "leaf" : true,
                "Name" : "T0",
                "StartDate" : "2010-02-02",
                "BaselineStartDate" : "2010-02-04",
                "parentId" : 100,
                "index": 0
            },
            { 
                "EndDate" : "2010-02-02",
                "BaselineEndDate" : "2010-02-01",
                "Id" : 3,
                "internalId": 3,
                "Name" : "T3",
                "StartDate" : "2010-01-18",
                "BaselineStartDate" : "2010-01-13",
                "expanded" : true,
                "leaf" :true,
                "parentId": 100,
                "index": 3
                },
            { 
                "EndDate" : "2010-02-02",
                "BaselineEndDate" : "2010-02-01",
                "Id" : 1,
                "internalId": 1,
                "Name" : "T1",
                "StartDate" : "2010-01-18",
                "BaselineStartDate" : "2010-01-13",
                "expanded" : true,
                "leaf" :true,
                "parentId": 100,
                "index": 1
            },
            { 
                "EndDate" : "2010-02-02",
                "BaselineEndDate" : "2010-02-01",
                "Id" : 40,
                "internalId": 40,
                "Name" : "T40",
                "StartDate" : "2010-01-18",
                "BaselineStartDate" : "2010-01-13",
                "expanded" : true,
                "leaf" :true,
                "parentId": 4,
                "index": 0
            },
            { 
                "EndDate" : "2010-02-02",
                "BaselineEndDate" : "2010-02-01",
                "Id" : 4,
                "internalId": 4,
                "Name" : "T4",
                "StartDate" : "2010-01-18",
                "BaselineStartDate" : "2010-01-13",
                "expanded" : true,
                "leaf" :false,
                "parentId": 100,
                "index": 4
            },
            { 
                "EndDate" : "2010-02-02",
                "BaselineEndDate" : "2010-02-01",
                "Id" : 100,
                "internalId": 100,
                "Name" : "100",
                "StartDate" : "2010-01-18",
                "BaselineStartDate" : "2010-01-13",
                "expanded" : true,
                "leaf" :false,
                "parentId": null,
                "index": 0
                }
        ],
        data16 = [ 
            { 
                "EndDate" : "2010-01-28",
                "Id" : 11,
                "internalId": 11,
                "leaf" : true,
                "Name" : "T11",
                "StartDate" : "2010-01-18",
                "parentId" : 1,
                "index": 0
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 12,
                "internalId": 12,
                "leaf" : true,
                "Name" : "T12",
                "StartDate" : "2010-01-28",
                "parentId" : 1,
                "index": 1
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 15,
                "internalId": 15,
                "leaf" : true,
                "Name" : "T15",
                "StartDate" : "2010-02-02",
                "parentId" : 1,
                "index": 4
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 13,
                "internalId": 13,
                "leaf" : true,
                "Name" : "T13",
                "StartDate" : "2010-01-25",
                "parentId" : 1,
                "index": 2
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 14,
                "internalId": 14,
                "leaf" : true,
                "Name" : "T14",
                "StartDate" : "2010-02-02",
                "parentId" : 1,
                "index": 3
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 16,
                "internalId": 16,
                "leaf" : true,
                "Name" : "T16",
                "StartDate" : "2010-02-02",
                "parentId" : 1,
                "index": 5
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 17,
                "internalId": 17,
                "leaf" : true,
                "Name" : "T17",
                "StartDate" : "2010-02-02",
                "parentId" : 1,
                "index": 6
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 18,
                "internalId": 18,
                "leaf" : true,
                "Name" : "T18",
                "StartDate" : "2010-02-02",
                "parentId" : 1,
                "index": 7
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 19,
                "internalId": 19,
                "leaf" : true,
                "Name" : "T19",
                "StartDate" : "2010-02-02",
                "parentId" : 1,
                "index": 8
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 20,
                "internalId": 20,
                "leaf" : true,
                "Name" : "T20",
                "StartDate" : "2010-02-02",
                "parentId" : 1,
                "index": 9
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 21,
                "internalId": 21,
                "leaf" : true,
                "Name" : "T21",
                "StartDate" : "2010-02-02",
                "parentId" : 1,
                "index": 10
            },
            { 
                "EndDate" : "2010-02-02",
                "Id" : 22,
                "internalId": 22,
                "leaf" : true,
                "Name" : "T22",
                "StartDate" : "2010-02-02",
                "parentId" : 1,
                "index": 11
            }
        ],
        data16a = [
            { 
                "EndDate" : "2010-02-02",
                "Id" : 1,
                "internalId": 1,
                "Name" : "T1",
                "StartDate" : "2010-01-18",
                "leaf" :false,
                "parentId": null,
                "index": 0
            }
        ],
        data17 = [{
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 202,
                "internalId": 202,
                "StartDate": "2010-02-03",
                "EndDate": "2010-02-07",
                "PercentDone": 0,
                "Name": "Parent 202",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": null,
                "index": 0
            },
            {
                "children": null,
                "leaf": true,
                "expanded": false,
                "Id": 203,
                "internalId": 203,
                "StartDate": "2010-01-25",
                "EndDate": "2010-01-25",
                "PercentDone": 0,
                "Name": "Child for 201",
                "Duration": 6,
                "DurationUnit": "d",
                "parentId": 201,
                "index": 0
            } 
        ],
    data18 = [
        {
            "index":1,
            "StartDate":"2012-12-03",
            "leaf":false,
            "expanded":false,
            "parentId":null,
            "EndDate":"2012-12-12",
            "Id":2,
            "internalId": 2,
            "Name":"2:1"
        },
        {
            "index":11,
            "StartDate":"2012-10-26",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-11-17",
            "Id":3,
            "internalId": 3,
            "Name":"3:11"
        },
        {
            "index":0,
            "StartDate":"2012-11-14",
            "leaf":true,
            "expanded":false,
            "parentId":1,
            "EndDate":"2012-11-14",
            "Id":4,
            "internalId": 4,
            "Name":"4:0"
        },
        {
            "index":3,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":1,
            "EndDate":"2012-12-26",
            "Id":5,
            "internalId": 5,
            "Name":"5:3"
        },
        {
            "index":10,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":6,
            "internalId": 6,
            "Name":"6:10"
        },
        {
            "index":5,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":1,
            "EndDate":"2012-12-26",
            "Id":7,
            "internalId": 7,
            "Name":"7:5"
        },
        {
            "index":0,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":8,
            "internalId": 8,
            "Name":"8:0"
        },
        {
            "index":7,
            "StartDate":"2012-12-26",
            "leaf":true,
            "expanded":false,
            "parentId":1,
            "EndDate":"2012-12-27",
            "Id":9,
            "internalId": 9,
            "Name":"9:7"
        },
        {
            "index":1,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":1,
            "EndDate":"2012-12-26",
            "Id":10,
            "internalId": 10,            
            "Name":"10:1"
        },
        {
            "index":2,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":11,
            "internalId": 11,
            "Name":"11:2"
        },
        {
            "index":3,
            "StartDate":"2012-12-26",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-27",
            "Id":12,
            "internalId": 12,
            "Name":"12:3"
        },
        {
            "index":2,
            "StartDate":"2012-12-27",
            "leaf":true,
            "expanded":false,
            "parentId":1,
            "EndDate":"2012-12-28",
            "Id":13,
            "internalId": 13,
            "Name":"13:2"
        },
        {
            "index":5,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":14,
            "internalId": 14,
            "Name":"14:5"
        },
        {
            "index":6,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":15,
            "internalId": 15,
            "Name":"15:6"
        },
        {
            "index":6,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":1,
            "EndDate":"2012-12-26",
            "Id":16,
            "internalId":16,
            "Name":"16:6"
        },
        {
            "index":4,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":1,
            "EndDate":"2012-12-26",
            "Id":17,
            "internalId": 17,
            "Name":"17:4"
        },
        {
            "index":7,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":18,
            "internalId": 18,
            "Name":"18:7"
        },
        {
            "index":8,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":1,
            "EndDate":"2012-12-26",
            "Id":19,
            "internalId": 19,
            "Name":"19:8"
        },
        {
            "index":9,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":20,
            "internalId": 20,
            "Name":"20:9"
        },
        {
            "index":8,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":21,
            "internalId": 21,
            "Name":"21:8"
        },
        {
            "index":1,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":22,
            "internalId": 22,
            "Name":"22:1"
        },
        {
            "index":4,
            "StartDate":"2012-12-25",
            "leaf":true,
            "expanded":false,
            "parentId":2,
            "EndDate":"2012-12-26",
            "Id":23,
            "internalId": 23,
            "Name":"23:4"
        },
        {
            "index":0,
            "StartDate":"2012-12-25T09:00:00",
            "leaf":false,
            "expanded":true,
            "parentId":null,
            "EndDate":"2012-12-31T18:00:00",
            "Id": 1,
            "internalId": 1,
            "Name":"1:0"
        }
    ],
    data19 = [
        {
            "leaf":false,
            "parentId":"b77a6d92-7a94-4301-a7c5-8b55117a5279",
            "EndDate":"2012-12-01",
            "Name":"2",
            "index":0,
            "StartDate":"2012-11-30",
            "expanded":true,
            "Id":"24c55d1b-fdef-4a9d-9653-0e35d8982e5e",
            "internalId":"24c55d1b-fdef-4a9d-9653-0e35d8982e5e"
        },
        {
            "leaf":true,
            "parentId":"24c55d1b-fdef-4a9d-9653-0e35d8982e5e",
            "EndDate":"2012-12-01",
            "Name":"3",
            "index":0,
            "StartDate":"2012-11-30",
            "expanded":true,
            "Id":"3a6dab55-ccd6-48b6-99d0-9ae517e9d96c",
            "internalId":"3a6dab55-ccd6-48b6-99d0-9ae517e9d96c"
        },
        {
            "index":0,
            "StartDate":"2010-01-21T09:00:00",
            "leaf":false,
            "expanded":true,
            "parentId":null,
            "EndDate":"2010-02-12T18:00:00",
            "Id":"b77a6d92-7a94-4301-a7c5-8b55117a5279",
            "internalId":"b77a6d92-7a94-4301-a7c5-8b55117a5279",
            "Name":"1"
        }
    ];

    t.wait('loadDataTests');


    t.waitForStoresToLoad(taskStore, function(){
        t.is(countNodes(root), 8, 'Initial amount of nodes loaded.');

        //try to add empty array
        taskStore.loadData([], {addRecords: true});
        t.is(countNodes(root), 8, 'Amount of nodes after adding empty array.');

        t.willFireNTimes(taskStore, 'update', 0, 'No `update` event fired when loading data without `syncStore` option.');
        taskStore.loadData(data1, {addRecords: true});
        var node1 = findNode(taskStore.getRootNode(), 201);
        t.is(countNodes(root), 9, 'Amount after loaded one parent node.');
        t.ok(node1.isMilestone(), 'Node with end and start dates equal but without duration specified successfully set as milestone.');

        //append/load nodes to store that wasn't initially loaded (so no root node was created)
        taskStore2.loadData(data1, {addRecords: true});
        var root2 = taskStore2.getRootNode();
        t.ok(root2, 'Root node defined after appending data without initial store load'); 
        t.is(countNodes(root2), 1, 'Amount after appending one parent node without initial store load');

        taskStore2.loadData(data1);
        root2 = taskStore2.getRootNode();
        t.ok(root2, 'Root node defined after loading data without initial store load'); 
        t.is(countNodes(root2), 1, 'Amount after loading one parent node without initial store load');

        t.willFireNTimes(taskStore2, 'datachanged', 1, 'One `datachanged` event will be fired when loading 3 records.');
        t.willFireNTimes(taskStore2, 'refresh', 1, 'One `refresh` event will be fired when loading 3 records.');    
        taskStore2.loadData(data2b);
        t.is(countNodes(root2), 3, 'Amount after loaded three nodes, and parent coming after child.');
        var node0 = findNode(taskStore2.getRootNode(), 201);
        t.is(node0.childNodes.length, 1, 'One node loaded as child node of #201');

        t.willFireNTimes(taskStore3, 'update', 2, 'Two `update` events fired when loading data with `syncStore` option.');
        t.willFireNTimes(taskStore3, 'beforesync', 1, 'One `beforesync` event will be fired when loading 3 records and with `syncStore` option.');
        taskStore3.loadData(data1); 
        taskStore3.loadData(data2b, {addRecords: true, syncStore: true});    
        //end of tests for store that wasn't loaded initially

        taskStore.loadData(data2, {addRecords: true});
        node1 = findNode(taskStore.getRootNode(), 201);
        t.is(countNodes(root), 11, 'Amount after loaded three nodes, one already added.');
        t.is(node1.get('Name'), 'Parent 201 Update', 'Node with Id 201 Name was updated successfully.');
        t.is(node1.childNodes.length, 1, 'One node added to children of #201 node.');
        t.is(node1.getEndDate().getMonth(), 1, "Event's date changed to match child date");

        taskStore.loadData(data3,{addRecords: true});
        t.is(countNodes(root), 13, 'Amount after loaded two records of model type.');
        var node2 = findNode(taskStore.getRootNode(), 204);
        var node3 = findNode(taskStore.getRootNode(), 202);
        t.is(node2.childNodes.length, 1, 'One node added to children of #204, when both where added in the same loadData call.');
        t.notOk(node3.isMilestone(), 'Node #202 is not a milestone anymore');
        
        taskStore.loadData(data4, {addRecords: true});
        var node4 = findNode(taskStore.getRootNode(), 205);
        t.is(node4.get('parentId'), 201, 'parentId for node changed');
        var node5 = findNode(taskStore.getRootNode(), 203);
        t.is(countNodes(node1), 3, 'Node #201 has 3 children now');
        t.is(node3.getChildAt(0), node5, 'Node #203 moved to child nodes of #202');
        t.notOk(node3.isMilestone(), 'Node #202 is not a milestone even though it was added with end and start dates equal.'+
            'Adding child with dates overrided this fact.');

        taskStore.loadData(data5, {addRecords: true});
        var node6 = findNode(taskStore.getRootNode(), 206);
        t.ok(node6, 'Node with incomplete data loaded successfully.');

        //check if node loaded without parentId will be updated properly
        taskStore.loadData(data5b, {addRecords: true});
        t.is(node6.get('Name'), 'Child for 202 Updated', 'Node loaded with id and name only loaded successfully.');       
        
        t.throwsOk(function(){
            taskStore.loadData(data6, {addRecords: true});
        }, 'Invalid data, possible infinite loop.', 'Nodes recursively dependent not loaded to prevent infinite loop.');

        taskStore.loadData(data2);
        t.is(countNodes(root), 3, 'Data loaded without addRecords parameter. Store cleaned and 3 tasks loaded.');
       
        taskStore.loadData(data7, {addRecords: true});
        var node7 = findNode(taskStore.getRootNode(), 201);
        var node8 = findNode(taskStore.getRootNode(), 209);
        t.is(node7.getChildAt(1), node8, 'Node #209 added as second child even though index was set to 9999');  
        t.is(node8.get('expanded'), false, 'Nodes without children cannot be expanded.');

        taskStore.loadData(data8, {addRecords: true});

        var node9 = findNode(taskStore.getRootNode(), 210);
        var node10 = findNode(taskStore.getRootNode(), 203);
        t.is(node9.parentNode, node10, 'Node dependencies properly set, when parent changed parentId with load.');
        t.notOk(node10.isMilestone(), 'Node #202 is not a milestone even though it was added with end and start dates equal,' 
            +'and came after its child in the data array. Adding child with dates overrided this fact.');

        taskStore.loadData(data9, {addRecords: true});
        var node11 = findNode(taskStore.getRootNode(), 211);
        var node12 = findNode(taskStore.getRootNode(), 212);
        t.is(node10.parentNode, node12, 'parentId of exitsting node changed to node added on load');
        t.is(node11.parentNode, node10, 'parentId of new node changed to existing node which had its parentId changed');

        //changing parent to own child, child not changed. Should leave structure as it is
        taskStore.loadData(data10, {addRecords: true});
        t.is(node10.parentNode, node12, 'Trying to change parent to own child (without modifying child) leaves structure as it is.');

        //changing parent to own child, child changed. Should change structure accordingly.
        taskStore.loadData(data11, {addRecords: true});
        t.is(node10.parentNode, node11, 'Trying to change parent to own child (modifying child) modifies structure acrordingly.');

        //load tasks with 2 level of dependency
        taskStore.loadData(data12);
        t.is(countNodes(root), 6, 'All nodes from bigger structure loaded correctly.');

        //move node with children from 1 level to root
        taskStore.loadData(data13, {addRecords: true});
        var node13 = findNode(taskStore.getRootNode(), 215);
        t.is(node13.parentNode, root, 'Node on lvl 1 with child nodes moved to root');

        taskStore.loadData(data14);
        t.is(countNodes(root), 6, 'All nodes from bigger structure with random ordering loaded correctly.');
        var node14 = findNode(taskStore.getRootNode(), 215);

        taskStore.loadData(data13, {addRecords: true});
        t.is(node14.parentNode, root, 'Node on lvl 1 with child nodes moved to root');

        //new test, extended version of adding parent/child nodes in mixed order
        taskStore.loadData(data15);
        var node15 = findNode(taskStore.getRootNode(), 40);
        var node16 = findNode(taskStore.getRootNode(), 4);
        t.is(node15.parentNode, node16, 'parent/child nodes successfully loaded when order was mixed');

        //load tasks without recalculating parents
        taskStore.recalculateParents = false;
        taskStore.loadData(data2);
        var node17 = findNode(taskStore.getRootNode(), 201);
        t.is(node17.getStartDate(), new Date(2010, 1, 3), "Parent event's start date not changed");
        t.is(node17.getEndDate(), new Date(2010, 1, 11), "Parent event's end date not changed");

        //load tasks with given indexes and parent already loaded
        t.diag('Check indexes of nodes when records are added to parent');
        taskStore.recalculateParents = true;
        taskStore.loadData(data16a);
        var node18 = findNode(taskStore.getRootNode(), 1);
        taskStore.loadData(data16, {addRecords: true});
        t.is(node18.indexOfId(11), 0, 'Correct index of child.');
        t.is(node18.indexOfId(12), 1, 'Correct index of child.');
        t.is(node18.indexOfId(13), 2, 'Correct index of child.');
        t.is(node18.indexOfId(14), 3, 'Correct index of child.');
        t.is(node18.indexOfId(15), 4, 'Correct index of child.');
        t.is(node18.indexOfId(16), 5, 'Correct index of child.');
        t.is(node18.indexOfId(17), 6, 'Correct index of child.');
        t.is(node18.indexOfId(18), 7, 'Correct index of child.');
        t.is(node18.indexOfId(19), 8, 'Correct index of child.');
        t.is(node18.indexOfId(20), 9, 'Correct index of child.');
        t.is(node18.indexOfId(21), 10, 'Correct index of child.');
        t.is(node18.indexOfId(22), 11, 'Correct index of child.');

        //load tasks with given indexes and their parent
        t.diag('Check indexes of task when records are loaded with parent');
        var data = data16.concat(data16a);

        taskStore.loadData(data);
        var node19 = findNode(taskStore.getRootNode(), 1);

        t.is(node19.indexOfId(11), 0, 'Correct index of child.');
        t.is(node19.indexOfId(12), 1, 'Correct index of child.');
        t.is(node19.indexOfId(13), 2, 'Correct index of child.');
        t.is(node19.indexOfId(14), 3, 'Correct index of child.');
        t.is(node19.indexOfId(15), 4, 'Correct index of child.');
        t.is(node19.indexOfId(16), 5, 'Correct index of child.');
        t.is(node19.indexOfId(17), 6, 'Correct index of child.');
        t.is(node19.indexOfId(18), 7, 'Correct index of child.');
        t.is(node19.indexOfId(19), 8, 'Correct index of child.');
        t.is(node19.indexOfId(20), 9, 'Correct index of child.');
        t.is(node19.indexOfId(21), 10, 'Correct index of child.');
        t.is(node19.indexOfId(22), 11, 'Correct index of child.');

        t.diag('Check indexes of tasks when records and parents are loaded, parents come first or last');

        taskStore.loadData(data18);
        var node20 = taskStore.getRootNode(),
            node21 = findNode(node20, 1),
            node22 = findNode(node20, 2);

        t.is(node20.indexOf(node21), 0, 'Correct index of child.');
        t.is(node20.indexOf(node22), 1, 'Correct index of child.');

        t.is(node21.indexOfId(4), 0, 'Correct index of child.');
        t.is(node21.indexOfId(10), 1, 'Correct index of child.');
        t.is(node21.indexOfId(13), 2, 'Correct index of child.');
        t.is(node21.indexOfId(5), 3, 'Correct index of child.');
        t.is(node21.indexOfId(17), 4, 'Correct index of child.');
        t.is(node21.indexOfId(7), 5, 'Correct index of child.');
        t.is(node21.indexOfId(16), 6, 'Correct index of child.');
        t.is(node21.indexOfId(9), 7, 'Correct index of child.');
        t.is(node21.indexOfId(19), 8, 'Correct index of child.');

        t.is(node22.indexOfId(8), 0, 'Correct index of child.');
        t.is(node22.indexOfId(22), 1, 'Correct index of child.');
        t.is(node22.indexOfId(11), 2, 'Correct index of child.');
        t.is(node22.indexOfId(12), 3, 'Correct index of child.');
        t.is(node22.indexOfId(23), 4, 'Correct index of child.');
        t.is(node22.indexOfId(14), 5, 'Correct index of child.');
        t.is(node22.indexOfId(15), 6, 'Correct index of child.');
        t.is(node22.indexOfId(18), 7, 'Correct index of child.');
        t.is(node22.indexOfId(21), 8, 'Correct index of child.');
        t.is(node22.indexOfId(20), 9, 'Correct index of child.');
        t.is(node22.indexOfId(6), 10, 'Correct index of child.');
        t.is(node22.indexOfId(3), 11, 'Correct index of child.');

        t.diag("Tests with string ID's");

        taskStore.loadData(data19);
        var node23 = findNode(taskStore.getRootNode(), 'b77a6d92-7a94-4301-a7c5-8b55117a5279'),
            node24 = findNode(taskStore.getRootNode(), '24c55d1b-fdef-4a9d-9653-0e35d8982e5e');

        t.is(node24.parentNode, node23, 'Correct parent node');
        t.ok(node24.childNodes.length, 'Task has child node');

        t.endWait('loadDataTests');
    });
    
    //Buffered case not yet supported
    var gantt = t.getGantt({
        renderTo: Ext.getBody(),
        taskStore: taskStore4,
        height: 100
    });

    taskStore4.loadData(data2);

    //scroll position and loading data to buffered store test
    t.waitForEventsToRender(gantt, function(){
        //Buffered case not yet supported
        //t.pass('Events rendered when buffered store is used.');

        var el = gantt.getSchedulingView().getEl();

        gantt.expandAll();

        el.scroll('down', 50);

        gantt.taskStore.loadData(data12, {addRecords: true});

        t.isGreater(el.getScroll().top, 0, 'Panel scrolled after loading data');

        t.waitForEvent(gantt.taskStore, 'refresh', function(){
            var node202 = findNode(gantt.taskStore.getRootNode(), 202),
                node203 = findNode(gantt.taskStore.getRootNode(), 203),
                el202   = gantt.getSchedulingView().getElementFromEventRecord(node202),
                el203   = gantt.getSchedulingView().getElementFromEventRecord(node203);

            t.hasNotCls(el202, 'sch-gantt-milestone-diamond-ct', 'DOM node has no milestone class');
            t.hasCls(el203, 'sch-gantt-milestone-diamond-ct', 'DOM node has milestone css class');
        });

        gantt.taskStore.loadData(data17, {addRecords: true});
        gantt.expandAll();
    });

});