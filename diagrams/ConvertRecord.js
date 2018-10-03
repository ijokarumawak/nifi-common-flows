var f1_1 = new FlowFile('1', 1);
f1_1.position = { x: 20, y: 50 };
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

var diagram = new FlowDiagram('ConvertRecord', 0, [
    {
        render: [f1_1]
    },
    {
        render: [f1_1, p1, a1]
    },
    {
        highlight: {
            flowFiles: [
                {d: f1_1}
            ]
        }
    },
    {
        highlight: {
            processors: [
                {d: p1, properties: ['Record Reader']}
            ]
        }
    },
    {
        render: [f1_1, p1, a1, cs1],
        highlight: {
            processors: [
                {d: p1, properties: ['Record Reader']}
            ],
            controllerServices: [
                {d: cs1}
            ]
        }
    },
    {
        render: [f1_1, p1, a1, cs1, cs2],
        highlight: {
            processors: [
                {d: p1, properties: ['Record Writer']}
            ],
            controllerServices: [
                {d: cs2}
            ]
        }
    },
    {
        render: [f1_1, p1, a1, cs1, cs2, f1_2, a2],
        highlight: {
            flowFiles: [
                {d: f1_2}
            ]
        }
    }
]);

diagram.render();
