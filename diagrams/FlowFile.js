var createFlowDiagram = function() {
    var f1 = new FlowFile('1');
    f1.attributes = [
        {name: 'absolute.path', value: '/var/data/inputs'},
        {name: 'filename', value: 'sample.txt'},
        {name: 'fileSize', value: '583'},
        {name: 'file.owner', value: 'foo'},
        {name: 'file.group', value: 'staff'},
        {name: 'file.permissions', value: 'rw-r--r--'},
        {name: 'file.lastAccessTime', value: '2018-10-15T16:17:00+0900'},
        {name: 'file.lastModifiedTime', value: '2017-11-10T18:24:28+0900'}
    ];

    var file1 = new DataObject('fa-file', '1', 'sample.txt');
    file1.headers = [
        {name: 'size', value: '583'},
        {name: 'owner', value: 'foo'},
        {name: 'group', value: 'staff'},
        {name: 'permissions', value: 'rw-r--r--'},
        {name: 'lastAccessTime', value: '2018-10-15T16:17:00+0900'},
        {name: '.lastModifiedTime', value: '2017-11-10T18:24:28+0900'}
    ];

    var p1 = new Processor('1', 'GetFile');
    p1.properties = [
        {name: 'Input Directory', value: '/var/data/inputs'}
    ]

    var ds = new DataSet('fa-folder', '1', '/var/data/inputs', [file1]);
    return new FlowDiagram({
        title: 'FlowFile',
        description: 'NiFiで扱うデータの単位、FlowFileってなんでしょう?',
        flowFiles: [f1],
        processors: [p1],
        dataSets: [ds],
        arrows: [new Arrow('0', file1, p1), new Arrow('1', p1, f1)],
        tooltips: [new Tooltip('0')],
        actions: [
            {
                'data-set_1': {x: 25, y: 25},
                'data-object_1': {
                    visible: true, highlight: true,
                    showHeaders: true, showContent: true,
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eleifend et massa eget hendrerit. Maecenas feugiat urna ut justo tempus mollis. Quisque rutrum nibh eget augue ultricies pretium. Vestibulum vitae sollicitudin diam. Nullam faucibus nunc eu nisl volutpat, aliquam convallis nunc malesuada. Donec ut eros at ex tincidunt rutrum. Duis ex lorem, suscipit quis placerat id, dignissim ut velit. Duis venenatis dolor id odio pellentesque, id posuere lectus fringilla. Suspendisse potenti. Sed quis posuere elit. Morbi molestie rutrum nulla, non ultricies enim aliquet sit amet.'
                },
                'tooltip_0': {
                    visible: true, x: 480, y: 100,
                    content: `このようなテキストファイルがあったとします。`
                }
            },
            {
                'tooltip_0': {
                    content: `これをNiFiに取り込むには...`
                }
            },
            {
                'data-object_1': {
                    content: 'Lorem ipsum dolor sit amet, ...'
                },
                'processor_1': {
                    x: 85, y: 454, visible: true, showProperties: true, highlight: true
                },
                'arrow_0': {
                    visible: true
                },
                'tooltip_0': {
                    x: 360, y: 450,
                    content: `GetFileというProcessorを使います。`
                }
            },
            {
                'data-object_1': {
                    highlight: false
                },
                'flow-file_1': {
                    x: 495, y: 380, visible: true, highlight: true
                },
                'arrow_1': {
                    visible: true
                },
                'tooltip_0': {
                    x: 555, y: 350,
                    content: `GetFileはファイルを読み込み、NiFiのFlowFileを作成します。`
                }
            },
            {
                'flow-file_1': {
                    x: 423, y: 43, showAttributes: true
                },
                'tooltip_0': {
                    x: 571, y: 34, 
                    content: `FlowFileにはデータのメタ情報を持つ、**Attribute**と`
                }
            },
            {
                'flow-file_1': {
                    showContent: true,
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eleifend et massa eget hendrerit. Maecenas feugiat urna ut justo tempus mollis. Quisque rutrum nibh eget augue ultricies pretium. Vestibulum vitae sollicitudin diam. Nullam faucibus nunc eu nisl volutpat, aliquam convallis nunc malesuada. Donec ut eros at ex tincidunt rutrum. Duis ex lorem, suscipit quis placerat id, dignissim ut velit. Duis venenatis dolor id odio pellentesque, id posuere lectus fringilla. Suspendisse potenti. Sed quis posuere elit. Morbi molestie rutrum nulla, non ultricies enim aliquet sit amet.'
                },
                'tooltip_0': {
                    x: 350, y: 485, 
                    content: `コンテンツを保持する**Content**があります。`
                }
            },
            {
                'data-object_1': {
                    showHeaders: false, showContent: false
                },
                'processor_1': {
                    x: 17, y: 145, highlight: false
                },
                'flow-file_1': {
                    x: 432, y: 30
                },
                'tooltip_0': {
                    x: 17, y: 262, width: '350px', height: '350px',
                    content: `AttributeはNiFiのJVMヒープ上に展開されています。サイズの大きな文字列、例えば巨大なJSONなどをAttributeに展開してしまうと、OutOfMemoryErrorを誘発する可能性があるので注意が必要です。`
                }
            },
            {
                'tooltip_0': {
                    content: `一方、ContentはProcessorでデータを扱う際にのみメモリ上にします。データ型が許せば、ストリーム形式でデータを部分的に読み込み、都度処理を行います。`
                }
            }
        ]
    });
}