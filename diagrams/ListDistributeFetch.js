var createFlowDiagram = function() {

    var file1 = new DataObject('fa-file', '1', '1.txt');
    var file2 = new DataObject('fa-file', '2', '2.txt');
    var file3 = new DataObject('fa-file', '3', '3.txt');

    var s3 = new DataSet('fa-cloud', '1', 'AWS S3', [file1, file2, file3]);

    var p11 = new Processor('1_1', 'ListS3');
    p11.node = '1 (P)';

    var p12 = new Processor('1_2', 'ListS3');
    p12.node = '2';

    var p13 = new Processor('1_3', 'ListS3');
    p13.node = '3';

    var p21 = new Processor('2_1', 'FetchS3Object');
    p21.node = '1 (P)';

    var p22 = new Processor('2_2', 'FetchS3Object');
    p22.node = '2';

    var p23 = new Processor('2_3', 'FetchS3Object');
    p23.node = '3';

    var port1 = new Processor('port1', 'InputPort');
    port1.node = '1 (P)';

    var port2 = new Processor('port2', 'InputPort');
    port2.node = '2';

    var port3 = new Processor('port3', 'InputPort');
    port3.node = '3';

    var rpg1 = new Processor('rpg1', 'RPG');
    rpg1.node = '1 (P)';

    var rpg2 = new Processor('rpg2', 'RPG');
    rpg2.node = '2';

    var rpg3 = new Processor('rpg3', 'RPG');
    rpg3.node = '3';
    
    var ff1 = new FlowFile('1');
    ff1.attributes = [{name: 'filename', value: '1.txt'}];
    var ff2 = new FlowFile('2');
    ff2.attributes = [{name: 'filename', value: '2.txt'}];
    var ff3 = new FlowFile('3');
    ff3.attributes = [{name: 'filename', value: '3.txt'}];

    return new FlowDiagram({
        title: 'List Distribute Fetchパターン',
        description: 'NiFiクラスタで効率的にデータをインジェストする',
        dataSets: [s3],
        flowFiles: [ff1, ff2, ff3],
        processors: [p11, p12, p13, p21, p22, p23, port1, port2, port3, rpg1, rpg2, rpg3],
        connections: [
            new Connection('1_1', 'success', p11, rpg1),
            new Connection('1_2', 'success', p12, rpg2),
            new Connection('1_3', 'success', p13, rpg3),
            new Connection('2_1', 'success', port1, p21),
            new Connection('2_2', 'success', port2, p22),
            new Connection('2_3', 'success', port3, p23),
        ],
        tooltips: [new Tooltip('0')],
        actions: [
            {
                'tooltip_0': {visible: true, x: 107, y: 205, content: 'List, Distribute, FetchパターンはリモートのデータをNiFiクラスタへと効率的にインジェストします'}
            },
            {
                'data-set_1': {x: 25, y: 70},
                'data-object_1': {visible: true},
                'data-object_2': {visible: true},
                'data-object_3': {visible: true},
                'processor_1_1': {visible: true, x: 180, y: 60},
                'processor_1_2': {visible: true, x: 430, y: 60},
                'processor_1_3': {visible: true, x: 680, y: 60},
                'processor_rpg1': {visible: true, x: 184, y: 400},
                'processor_rpg2': {visible: true, x: 434, y: 400},
                'processor_rpg3': {visible: true, x: 694, y: 400},
                'processor_port1': {visible: true, x: 225, y: 467},
                'processor_port2': {visible: true, x: 475, y: 467},
                'processor_port3': {visible: true, x: 725, y: 467},
                'processor_2_1': {visible: true, x: 200, y: 600},
                'processor_2_2': {visible: true, x: 450, y: 600},
                'processor_2_3': {visible: true, x: 720, y: 600},
                'tooltip_0': {x: 250, y: 200, content: 'S3のファイルを3台のNiFiクラスタで分散的に取得する例です'}
            },
            {
                'processor_1_1': {highlight: true},
                'flow-file_1': {visible: true, highlight: true, showAttributes: true},
                'flow-file_2': {visible: true, highlight: true},
                'flow-file_3': {visible: true, highlight: true},
                'connection_1_1': {flowFiles: [ff1, ff2, ff3]},
                'tooltip_0': {x: 355, y: 200, content:
`
ListS3はPrimary Nodeのみで実行されるように指定されています。

S3のバケットにアクセスし、未取得のファイルの情報をFlowFileに出力します。
`}
            },
            {
                'processor_1_1': {highlight: false},
                'processor_rpg1': {highlight: true},
                'tooltip_0': {content: 'FlowFileをノード間で分散させるために、Remote Process Groupを利用し、自クラスタへと転送します。'}
            },
            {
                'processor_port1': {highlight: true},
                'processor_port2': {highlight: true},
                'processor_port3': {highlight: true}
            },
            {
                'flow-file_1': {showAttributes: false},
            },
            {
                'processor_1_1': {highlight: false},
                'connection_1_1': {flowFiles: [ff2, ff3]},
                'connection_2_2': {flowFiles: [ff1]},
            },
            {
                'connection_1_1': {flowFiles: [ff2]},
                'connection_2_3': {flowFiles: [ff3]},
            },
            {
                'connection_1_1': {flowFiles: []},
                'connection_2_1': {flowFiles: [ff2]},
            },
            {
                'processor_rpg1': {y: 200},
                'processor_rpg2': {y: 200},
                'processor_rpg3': {y: 200},
                'processor_port1': {y: 267},
                'processor_port2': {y: 267},
                'processor_port3': {y: 267},
                'processor_2_1': {y: 380},
                'processor_2_2': {y: 380},
                'processor_2_3': {y: 380},
            },
            {
                'processor_rpg1': {highlight: false},
                'processor_port1': {highlight: false},
                'processor_port2': {highlight: false},
                'processor_port3': {highlight: false},
                'flow-file_1': {showAttributes: true},
                'flow-file_2': {showAttributes: true},
                'flow-file_3': {showAttributes: true},
                'processor_2_1': {y: 450},
                'processor_2_2': {y: 450},
                'processor_2_3': {y: 450},
                'tooltip_0': {x: 180, y: 147, content: 'この時点ではFlowFileのContentは空なので、ノード間でのデータ転送量は大したことはありません。'}
            },
            {
                'tooltip_0': {x: 170, y: 473, content: 'この例のように少量のデータで均等に分散するには、RPGのポート設定で、Batch Countに低い値を設定する必要があります。'}
            },
            {
                'processor_2_1': {highlight: true},
                'processor_2_2': {highlight: false},
                'processor_2_3': {highlight: false},
                'data-object_1': {highlight: false},
                'data-object_2': {highlight: true},
                'data-object_3': {highlight: false},
                'flow-file_1': {highlight: false},
                'flow-file_2': {highlight: true},
                'flow-file_3': {highlight: false},
                'tooltip_0': {x: 429, y: 542, content: '各NiFiノードから、FetchS3ObjectがS3のファイルデータをダウンロードします。'}
            },
            {
                'connection_2_1': {flowFiles: []},
                'flow-file_2': {x: 206, y: 460, showContent: true, content: 'ファイルデータ'},
                'processor_2_1': {y: 380},
            },
            {
                'processor_2_1': {highlight: false},
                'processor_2_2': {highlight: true},
                'processor_2_3': {highlight: false},
                'data-object_1': {highlight: true},
                'data-object_2': {highlight: false},
                'data-object_3': {highlight: false},
                'flow-file_1': {highlight: true},
                'flow-file_2': {highlight: false},
                'flow-file_3': {highlight: false},
                'tooltip_0': {x: 403, y: 90}
            },
            {
                'connection_2_2': {flowFiles: []},
                'flow-file_1': {x: 460, y: 460, showContent: true, content: 'ファイルデータ'},
                'processor_2_2': {y: 380},
            },
            {
                'processor_2_1': {highlight: false},
                'processor_2_2': {highlight: false},
                'processor_2_3': {highlight: true},
                'data-object_1': {highlight: false},
                'data-object_2': {highlight: false},
                'data-object_3': {highlight: true},
                'flow-file_1': {highlight: false},
                'flow-file_2': {highlight: false},
                'flow-file_3': {highlight: true},
            },
            {
                'connection_2_3': {flowFiles: []},
                'flow-file_3': {x: 720, y: 460, showContent: true, content: 'ファイルデータ'},
                'processor_2_3': {y: 380},
            },
        ]
    });
}