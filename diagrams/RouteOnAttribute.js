var createFlowDiagram = function() {
    var f1_1 = new FlowFile('1', 1);
    f1_1.attributes = [
        {name: 'filename', value: 'sample-1.txt'},
        {name: 'fileSize', value: '583'}
    ];

    var f2_1 = new FlowFile('2', 1);
    f2_1.attributes = [
        {name: 'filename', value: 'sample-2.txt'},
        {name: 'fileSize', value: '2095104'}
    ];

    var f1_2 = new FlowFile('1', 2);
    f1_2.attributes = [
        {name: 'filename', value: 'sample-1.txt'},
        {name: 'fileSize', value: '583'}
    ];

    var f2_2 = new FlowFile('2', 2);
    f2_2.attributes = [
        {name: 'filename', value: 'sample-2.txt'},
        {name: 'fileSize', value: '2095104'}
    ];

    var file1 = new DataObject('fa-file', '1', 'sample-1.txt');
    file1.headers = [
        {name: 'size', value: '583'}
    ];

    var file2 = new DataObject('fa-file', '2', 'sample-2.txt');
    file2.headers = [
        {name: 'size', value: '2095104'}
    ];
    
    var p1 = new Processor('1', 'GetFile');
    p1.properties = [
        {name: 'Input Directory', value: '/var/data/inputs'}
    ]

    var p2 = new Processor('2', 'RouteOnAttribute');
    p2.properties = [
        {name: 'Routing Strategy', value: 'Route to Property name'},
        {name: 'small-file', value: '${fileSize:lt(1048576)}'}
    ]

    var p3 = new Processor('3', 'LogAttribute');
    var p4 = new Processor('4', 'LogAttribute');

    var c1 = new Connection('1', 'success', p1, p2);
    var c2 = new Connection('2', 'small-file', p2, p3);
    var c3 = new Connection('3', 'unmatched', p2, p4);

    var ds = new DataSet('fa-folder', '1', '/var/data/inputs', [file1, file2]);
    return new FlowDiagram({
        title: 'RouteOnAttribute',
        description: 'AttributeでFlowFileを振り分ける',
        flowFiles: [f1_1, f2_1, f1_2, f2_2],
        processors: [p1, p2, p3, p4],
        dataSets: [ds],
        arrows: [new Arrow('0', ds, p1)],
        tooltips: [new Tooltip('1')],
        connections: [c1, c2, c3],
        actions: [
            {
                'data-set_1': {
                    x: 70, y: 20
                },
                'data-object_1': {
                    visible: true, showHeaders: true
                },
                'data-object_2': {
                    visible: true, showHeaders: true
                },
                'processor_1': {
                    x: 300, y: 20,
                    visible: true
                },
                'arrow_0': {
                    visible: true
                },
                'tooltip_1': {
                    visible: true, x: 308, y: 268,
                    content: 'FlowFileをAttributeによってルーティングする例です。'
                }
            },
            {
                'processor_1': {
                    highlight: true
                },
                'processor_2': {
                    x: 260, y: 308,
                    visible: true
                },
                'tooltip_1': {
                    x: 425, y: 15,
                    content: 'GetFileを使って'
                }
            },
            {
                'processor_2': {
                    y: 430
                },
                'connection_1': {
                    flowFiles: [f1_1, f2_1]
                },
                'flow-file_1_1': {
                    visible: true, highlight: true, showAttributes: true
                },
                'flow-file_2_1': {
                    visible: true, highlight: true, showAttributes: true
                },
                'tooltip_1': {
                    x: 500, y: 215,
                    content: '2つのファイルを読み込みました。ここで、ファイルサイズによって２つのルートに分けたいと思います。'
                }
            },
            {
                'processor_1': {highlight: false},
                'processor_2': {
                    x: 250, y: 275, highlight: true
                },
                'flow-file_1_1': {showAttributes: false},
                'flow-file_2_1': {showAttributes: false}
            },
            {
                'processor_2': {
                    x: 200, showProperties: true, highlight: {properties: ['Routing Strategy']}
                },
                'flow-file_1_1': {highlight: false},
                'flow-file_2_1': {highlight: false},
                'tooltip_1': {
                    x: 18, y: 436,
                    content: '"Route to Property name"を使うと、Dynamic Propertyで設定したProperty名のRelationに、一致したFlowFileをルーティングできます。'
                }
            },
            {
                'processor_2': {
                    highlight: {properties: ['small-file']}
                },
                'tooltip_1': {
                    content:
`
ファイルサイズが1MB未満の場合は"small-file"というRelationにルーティングします。

ここではAttribute Expression Languageを利用しています。
\`\`\`
\${fileSize:lt(1048576)}
\`\`\`
`
                }
            },
            {
                'processor_3': {
                    x: 780, y: 180,
                    visible: true
                }
            },
            {
                'processor_4': {
                    x: 780, y: 500,
                    visible: true
                },
                'tooltip_1': {
                    content: '条件に一致しなかったFlowFileは"unmatched"に振り分けられます。'
                }
            },
            {
                'connection_2': {
                    flowFiles: [f1_2]
                },
                'flow-file_1_1': {highlight: true},
                'flow-file_1_2': {visible: true, highlight: true, showAttributes: true}
            },
            {
                'connection_3': {
                    flowFiles: [f2_2]
                },
                'flow-file_1_1': {highlight: false},
                'flow-file_1_2': {highlight: false},
                'flow-file_2_1': {highlight: true},
                'flow-file_2_2': {visible: true, highlight: true, showAttributes: true}
            },
            {
                'flow-file_2_1': {highlight: false},
                'flow-file_2_2': {highlight: false},
                'processor_2': {highlight: false},
                'tooltip_1': {
                    content:
`
## まとめ

- Attribute Expression Languageを使いこなしてFlowFileを自在にルーティング
- Attributeだけを見て、FlowFileを進めるには、Contentを参照する必要がない、オンメモリの情報で処理できるので高速

さらに詳細なExpressionに関する説明は
<a href="https://nifi.apache.org/docs/nifi-docs/html/expression-language-guide.html"
   target="_blank">Apache NiFi Expression Language Guide</a>
を参照しましょう。
`
                }
            }
        ]
    });
}