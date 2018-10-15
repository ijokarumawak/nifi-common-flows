var createFlowDiagram = function() {
    var f1_1 = new FlowFile('1', 1);
    f1_1.attributes = [
        {name: 'mime.type', value: 'text/csv'}
    ];
    
    var f1_2 = new FlowFile('1', 2);
    f1_2.attributes = [
        {name: 'mime.type', value: 'application/json'}
    ];
    
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

    var tmpInRecords = new DataObject('fa-table', 'tmp-in', '入力レコード');
    var tmpOutRecords = new DataObject('fa-table', 'tmp-out', '出力レコード');
    var tmpData = new DataSet('', 'tmp', 'Processor内処理データ', [tmpInRecords, tmpOutRecords]);

    return new FlowDiagram({title: 'ConvertRecord',
        description: '最もシンプルな内容でRecordデータモデルの概念を理解しよう',
        flowFiles: [f1_1, f1_2],
        processors: [p1],
        controllerServices: [cs1, cs2],
        arrows: [new Arrow('0', f1_1, f1_2), a1, a2],
        tooltips: [tooltip],
        dataSets: [tmpData],
        actions: [
            {
                'tooltip_1': {
                    visible: true, x: 200, y: 420, content: 
`
CSVのデータをJSONに変換する簡単な例です。
`
                },
                'flow-file_1_1': {
                    visible: true, x: 120, y: 80, highlight: true, showAttributes: true, showContent: true, content:
`\`\`\`csv
id,v1,v2,v3
1,a,b,c
2,d,e,f
3,g,h,i
\`\`\``
                },
                'flow-file_1_2': {
                    visible: true, x: 420, y: 80, highlight: true, showAttributes: true, showContent: true, content:
`\`\`\`json
[ { "id" : "1", "v1" : "a", "v2" : "b", "v3" : "c" },
    { "id" : "2", "v1" : "d", "v2" : "e", "v3" : "f" },
    { "id" : "3", "v1" : "g", "v2" : "h", "v3" : "i" } ]
\`\`\``
                }, 
                'arrow_0': { visible: true }
            },
            {
                'flow-file_1_1': {
                    highlight: false, x: 20, y: 12
                },
                'flow-file_1_2': {
                    visible: false, highlight: false
                },
                'processor_1': {
                    visible: true, x: 270, y: 205, highlight: true
                },
                'arrow_0': { visible: false },
                'arrow_1': { visible: true },
                'tooltip_1': {
                    content: 
`
Recordが誕生する以前は、ConvertXToYという特定のデータ型変換を行うプロセッサを利用していました。
しかし、組み合わせの数だけProcessorの実装が必要なため非効率です。
代わりに、Recordという汎用的な型を扱える、ConvertRecordを推奨します。
`
                },
            },
            {
                'controller-services': {
                    x: 595, y: 38
                },
                'processor_1': {
                    showProperties: true, highlight: {properties: 'Record Reader'}
                },
                'controller-service_1': {
                    visible: true, highlight: true
                },
                'tooltip_1': {
                    content: 
`
FlowFileのContentをRecord型として処理するために、Record Readerが必要です。
例ではCSVを読み込むのでCSVReaderを使います。
`
                }
            },
            {
                'processor_1': {
                    x: 276, y: 100
                },
                'data-set_tmp': {
                    x: 312, y: 243
                },
                'data-object_tmp-in': {
                    visible: true, showContent: true, highlight: true, content:
`
| id (string)   | v1 (string) | v2 (string) | v3 (string) |
| ------------- |-------------|-------------|-------------|
| 1 | a | b | c |

`
                },
                'tooltip_1': {
                    content: 
`
Record Readerを利用して、1 Recordずつ、ストリーム形式で読み込んでいきます。
入力データが膨大なレコード数であっても、Java heap上には最小限のデータのみロードします。
このため、大きなファイルでも扱えるのです。
`
                }
            },
            {
                'processor_1': {
                    highlight: true
                },
                'controller-service_1': {
                    showProperties: true,
                    highlight: {properties: ['Schema Access Strategy']}
                },
                'tooltip_1': {
                    content: 
`
NiFiはRecordデータモデルを扱う際に、そのRecordはどういったデータを内包するのかを示すSchemaが必要になります。
この例では、\`Use String Fields From Header\`の設定により、入力CSVの1行目から自動的にSchemaが生成されます。
`
                }
            },
            {
                'processor_1': {
                    highlight: {properties: ['Record Writer']}
                },
                'controller-service_1': {
                    highlight: false
                },
                'controller-service_2': {
                    visible: true,
                    showProperties: true,
                    highlight: true
                },
                'tooltip_1': {
                    content: 
`
ConvertRecerdは読み込んだRecordをそのまま、RecordWriterで書き出します。
`
                }
            },
            {
                'processor_1': {highlight: true},
                'controller-service_2': {
                    highlight: {properties: ['Schema Access Strategy']}
                },
                'tooltip_1': {
                    content: 
`
出力のSchemaは、Readerが利用したものをそのまま引き継ぐ設定となっています。
`
                }
            },
            {
                'controller-service_2': {
                    highlight: {properties: ['Schema Write Strategy']}
                },
                'tooltip_1': {
                    content: 
`
JSONは単なるテキストで、それ自体にSchemaを持つことができません。
書き出しに利用したSchemaは特に出力FlowFileには保存しないので、'Do Not Write Schema'とします。
`
                }
            },
            {
                'controller-service_1': {highlight: false},
                'controller-service_2': {highlight: false},
                'flow-file_1_2': {
                    visible: true, x: 16, y: 430, highlight: true, content:
`\`\`\`json
[ { "id" : "1", "v1" : "a", "v2" : "b", "v3" : "c" }
\`\`\``
                },
                'arrow_2': {
                    visible: true
                },
                'tooltip_1': {
                    x: 508, y: 430,
                    content: 
`
出力のFlowFileが生成され、JSONが書き出されていきます。
`
                }
            },
            {
                'data-object_tmp-in': {
                    content:
`
| id (string)   | v1 (string) | v2 (string) | v3 (string) |
| ------------- |-------------|-------------|-------------|
| 2 | d | e | f |

`
                },
                'flow-file_1_2': {
                    content:
`\`\`\`json
[ { "id" : "1", "v1" : "a", "v2" : "b", "v3" : "c" },
    { "id" : "2", "v1" : "d", "v2" : "e", "v3" : "f" }
\`\`\``
                },
                'tooltip_1': {
                    content: 
`
残りの入力Recordを処理します。2/3
`
                }
            },
            {
                'data-object_tmp-in': {
                    content:
`
| id (string)   | v1 (string) | v2 (string) | v3 (string) |
| ------------- |-------------|-------------|-------------|
| 3 | h | i | j |

`
                },
                'flow-file_1_2': {
                    content:
`\`\`\`json
[ { "id" : "1", "v1" : "a", "v2" : "b", "v3" : "c" },
    { "id" : "2", "v1" : "d", "v2" : "e", "v3" : "f" },
    { "id" : "3", "v1" : "g", "v2" : "h", "v3" : "i" } ]
\`\`\``
                },
                'tooltip_1': {
                    content: 
`
残りの入力Recordを処理します。3/3
`
                }
            },
            {
                'processor_1': {highlight: false},
                'data-object_tmp-in': {visible: false},
                'tooltip_1': {
                    content: 
`
全ての入力レコードを処理し終えると、ConvertRecordの処理が完了します。
`                    
                }
            }
        ]
    });
}