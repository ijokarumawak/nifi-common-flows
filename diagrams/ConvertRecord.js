var createFlowDiagram = function() {
    var f1_1 = new FlowFile('1', 1);
    f1_1.position = { x: 200, y: 50 };
    f1_1.attributes = [];
    f1_1.content = {
        type: 'text',
        value: [
            "id,v1,v2,v3",
            "1,a,b,c",
            "2,d,e,f",
            "3,g,a,b"
        ]
    };
    f1_1.showData = true;
    f1_1.showAttributes = false;
    f1_1.showContent = true;
    
    var f1_2 = new FlowFile('1', 2);
    f1_2.position = { x: 20, y: 440 };
    f1_2.attributes = [];
    f1_2.content = {
        type: 'text',
        value: [
            "Avro Schema Data is embedded",
            "with Avro records:",
            "1,a,b,c",
            "2,d,e,f",
            "3,g,a,b"
        ]
    };
    f1_2.showData = true;
    f1_2.showContent = true;
    
    var p1 = new Processor('1', 'ConvertRecord');
    p1.position = { x: 300, y: 250 };
    p1.properties = [
        {
            name: 'Record Reader',
            value: 'CSVReader'
        },
        {
            name: 'Record Writer',
            value: 'AvroRecordSetWriter'
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
    
    var cs2 = new ControllerService('2', 'AvroRecordSetWriter');
    cs2.properties = [
        {
            name: 'Schema Access Strategy',
            value: 'Inherit Record Schema'
        },
        {
            name: 'Schema Write Strategy',
            value: 'Embed Avro Schema'
        }
    ];
    
    return new FlowDiagram({title: 'ConvertRecord',
        flowFiles: [f1_1, f1_2],
        processors: [p1],
        controllerServices: [cs1, cs2],
        arrows: [a1, a2],
        actions: [
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
                }
            },
            {
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