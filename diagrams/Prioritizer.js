var createFlowDiagram = function() {
    var f1_1 = new FlowFile('1', 1);
    var f2_1 = new FlowFile('2', 1);

    f1_1.attributes = [
        {name: 'priority', value: '11'}
    ];
    f2_1.attributes = [
        {name: 'priority', value: '13'}
    ];
    
    var p1 = new Processor('1', 'GenerateFlowFile');

    var p2 = new Processor('2', 'LogAttribute');
    
    var c1 = new Connection('1', 'success', p1, p2);

    c1.addFlowFiles(f1_1, f2_1);

    return new FlowDiagram({title: 'Prioritizers',
        flowFiles: [f1_1, f2_1],
        processors: [p1, p2],
        connections: [c1],
        actions: [
            {
                'processor_1': {
                    visible: true,
                    x: 200, y: 200
                },
                'processor_2': {
                    visible: true,
                    x: 200, y: 600
                },
                'flow-file_1_1': {
                    visible: true,
                    highlight: true
                }
            },
            {
                'flow-file_2_1': {
                    visible: true,
                    highlight: true
                }
            },
            {
                'flow-file_1_1': {
                    showAttributes: true
                },
                'flow-file_2_1': {
                    showAttributes: true
                }
            },
            {
                'processor_2': {
                    x: 400, y: 800
                }
            }
        ]
    });
}