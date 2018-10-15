var createFlowDiagram = function() {
    var f1_1 = new FlowFile('1', 1);
    f1_1.attributes = [
        {name: 'mime.type', value: 'text/csv'}
    ];
    
    var f1_2 = new FlowFile('1', 2);
    f1_2.attributes = [
        {name: 'mime.type', value: 'text/csv'}
    ];
    
    var p1 = new Processor('1', 'UpdateRecord');
    p1.properties = [
        {
            name: 'Record Reader',
            value: 'CSVReader'
        },
        {
            name: 'Record Writer',
            value: 'CSVRecordSetWriter'
        },
        {
            name: 'Replacement Value Strategy',
            value: 'Record Path Value'
        },
        {
            name: '/v2',
            value: `concat(/v1, ' and ', /v3)`
        }
    ];
    
    var a1 = new Arrow('1', f1_1, p1);
    var a2 = new Arrow('2', p1, f1_2);
    
    var tooltip = new Tooltip('1');

    var tmpInRecords = new DataObject('fa-table', 'tmp-in', '入力レコード');
    var tmpOutRecords = new DataObject('fa-table', 'tmp-out', '出力レコード');
    var tmpData = new DataSet('', 'tmp', 'Processor内処理データ', [tmpInRecords, tmpOutRecords]);

    return new FlowDiagram({title: 'UpdateRecord',
        description: 'RecordPathを使いこなそう',
        flowFiles: [f1_1, f1_2],
        processors: [p1],
        arrows: [new Arrow('0', f1_1, f1_2), a1, a2],
        tooltips: [tooltip],
        dataSets: [tmpData],
        actions: [
            {
                'tooltip_1': {
                    visible: true, x: 200, y: 420, content: 
`
UpdateRecordを使うと、Record Pathで指定した出力レコードの値を書き換えることができます。

地味ですが、'v2'列の値を書き換えています。
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
`\`\`\`csv
id,v1,v2,v3
1,a,a and c,c
2,d,d and f,f
3,g,g and i,i
\`\`\``
                }, 
                'arrow_0': { visible: true }
            },
            {
                'flow-file_1_1': {x: 40, y: 40},
                'flow-file_1_2': {visible: false},
                'arrow_0': {visible: false},
                'arrow_1': {visible: true},
                'processor_1': {
                    visible: true, showProperties: true, x: 245, y: 55,
                    highlight: {properties: ['Record Reader']}
                },
                'data-set_tmp': {
                    x: 315, y: 235
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
                    x: 610, y: 280,
                    content: 
`
Record Readerを利用して、1 Recordずつ、ストリーム形式で読み込んでいきます。
`
                }
            },
            {
                'processor_1': {
                    highlight: {properties: ['Replacement Value Strategy']}
                },
                'data-object_tmp-out': {
                    visible: true, showContent: true, highlight: true, content:
`
| id (string)   | v1 (string) | v2 (string) | v3 (string) |
| ------------- |-------------|-------------|-------------|
| 1 | a |  |  |

`                    
                },
                'tooltip_1': { content:
`
Record Pathを利用してデータ変換を行うように指定しています。
`

                }
            },
            {
                'processor_1': {
                    highlight: {properties: ['/v2']}
                },
                'data-object_tmp-out': {
                    visible: true, showContent: true, highlight: true, content:
`
| id (string)   | v1 (string) | v2 (string) | v3 (string) |
| ------------- |-------------|-------------|-------------|
| 1 | a | a and c | c |

`                    
                },
                'tooltip_1': { content:
`
'concat()'関数を使って、v1とv3の値を連結し、v2に設定します。
`                    
                }
            },
            {
                'flow-file_1_2': {
                    visible: true, x: 691, y: 40,
                    content:
`\`\`\`csv
id,v1,v2,v3
1,a,a and c,c
\`\`\``
                },
                'arrow_2': {
                    visible: true
                },
                'tooltip_1': {
                    content: 
`
変換結果を出力FlowFileに書き出します。
`
                }
            },
            {
                'processor_1': {highlight: false},
                'data-object_tmp-in': {visible: false},
                'data-object_tmp-out': {visible: false},
                'flow-file_1_1': {highlight: false},
                'flow-file_1_2': {
                    content:
`\`\`\`csv
id,v1,v2,v3
1,a,a and c,c
2,d,d and f,f
3,g,g and i,i
\`\`\``
                },
                'tooltip_1': {
                    content: 
`
全ての入力レコードを処理し終えると、ConvertRecordの処理が完了します。
`                    
                }
            },
            {
                'flow-file_1_2': {
                    highlight: false
                },
                'tooltip_1': {
                    x: 175, y: 325, content:
`
## まとめ

- Record Pathを使うと、JSON PathやXPathと同様に、NiFi Record内の要素を指定できる

さらに詳細なRecord Pathに関する説明は
<a href="https://nifi.apache.org/docs/nifi-docs/html/record-path-guide.html"
   target="_blank">Apache NiFi RecordPath Guide</a>
を参照しましょう。
`
                }
            }
        ]
    });
}