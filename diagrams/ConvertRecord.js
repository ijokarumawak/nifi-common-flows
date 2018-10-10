var createFlowDiagram = function() {
    var f1_1 = new FlowFile('1', 1);
    f1_1.attributes = [
        {name: 'mime.type', value: 'text/csv'}
    ];
    f1_1.content = {
        value:
`id,v1,v2,v3
1,a,b,c
2,d,e,f
3,g,a,b`
    };
    f1_1.showAttributes = true;
    f1_1.showContent = true;
    
    var f1_2 = new FlowFile('1', 2);
    f1_2.attributes = [
        {name: 'mime.type', value: 'application/json'}
    ];
    f1_2.content = {
        value:
`[ {
    "id" : "1",
    "v1" : "a",
    "v2" : "b",
    "v3" : "c"
    }, {
    "id" : "2",
    "v1" : "d",
    "v2" : "e",
    "v3" : "f"
    }, {
    "id" : "3",
    "v1" : "g",
    "v2" : "a",
    "v3" : "b"
    } ]`
    };
    f1_2.showData = true;
    f1_2.showAttributes = true;
    f1_2.showContent = true;
    
    var p1 = new Processor('1', 'ConvertRecord');
    p1.properties = [
        {
            name: 'Record Reader',
            value: 'CSVReader'
        },
        {
            name: 'Record Writer',
            value: 'JsonRecordSetWriter'
        }
    ];
    p1.showDetails = true;
    
    var a1 = new Arrow('1', f1_1, p1);
    var a2 = new Arrow('2', p1, f1_2);
    
    var cs1 = new ControllerService('1', 'CSVReader');
    cs1.properties = [
        {
            name: 'Schema Access Strategy',
            value: 'Use String Fields From Header'
        }
    ];
    
    var cs2 = new ControllerService('2', 'JsonRecordSetWriter');
    cs2.properties = [
        {
            name: 'Schema Access Strategy',
            value: 'Inherit Record Schema'
        },
        {
            name: 'Schema Write Strategy',
            value: 'Do Not Write Schema'
        }
    ];
    
    var tooltip = new Tooltip('1');

    return new FlowDiagram({title: 'ConvertRecord',
        flowFiles: [f1_1, f1_2],
        processors: [p1],
        controllerServices: [cs1, cs2],
        arrows: [a1, a2],
        tooltips: [tooltip],
        actions: [
            {
                'tooltip_1': {
                    render: true,
                    x: 200,
                    y: 100,
                    content: 'This is the beginning...'
                }
            },
            {
                'flow-file_1_1': {
                    render: true,
                    x: 20,
                    highlight: true
                }
            },
            {
                'flow-file_1_1': {
                    render: true,
                    x: 300
                },
                'flow-file_1_2': {
                    render: true,
                    y: 200,
                    highlight: true
                }
            },
            {
                'flow-file_1_1': {
                    highlight: false
                },
                'processor_1': {
                    render: true,
                    x: 400,
                    y: 250,
                    highlight: true
                },
                'arrow_1': {
                    render: true
                }
            },
            {
                'processor_1': {
                    highlight: {
                        properties: ['Record Reader']
                    }
                },
                'tooltip_1': {
                    x: 620,
                    y: 450,
                    content:
`
# Some Markdown content

hello world

1. one
2. two
3. three

- foo
- bar
- baz
`
                }
            },
            {
                'controller-services': {
                    x: 750,
                    y: 100
                },
                'controller-service_1': {
                    render: true,
                    highlight: true
                }
            },
            {
                'processor_1': {
                    highlight: {
                        properties: ['Record Writer']
                    }
                }
            },
            {
                'controller-service_2': {
                    render: true,
                    highlight: true
                }
            },
            {
                'arrow_2': {
                    render: true
                }
            }
        ]
    });
}