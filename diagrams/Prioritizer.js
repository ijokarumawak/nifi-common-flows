var createFlowDiagram = function() {

    var p1 = new Processor('1', 'Processor 1');
    var p2 = new Processor('2', 'Processor 2');
    var p3 = new Processor('3', 'Processor 3');

    var flowFiles = [];
    var initialAction = {
        'processor_1': {visible: true, x: 30, y: 300},
        'processor_2': {visible: true, x: 380, y: 300},
        'processor_3': {visible: true, x: 730, y: 300}
    };

    for (var i = 0; i < 5; i++) {
        var f = new FlowFile(i);
        f.attributes = [{name: 'priority', value: i % 3}];
        flowFiles.push(f);
        initialAction[f.toId()] = {visible: true, showAttributes: true};
    }

    initialAction['connection_1'] = {flowFiles: flowFiles};

    return new FlowDiagram({
        title: 'Prioritizer',
        description: '滞留しているFlowFileの処理優先度を制御する',
        flowFiles: flowFiles,
        processors: [p1, p2, p3],
        connections: [new Connection('1', 'success', p1, p2), new Connection('2', 'success', p2, p3)],
        tooltips: [new Tooltip('1')],
        actions: [
            initialAction,
            {
                'tooltip_1': {
                    visible: true, x: 365, y: 62,
                    content:
`
滞留したFlowFileの処理順序はConnectionのPrioritizerで制御可能です。
<img src="diagrams/images/priority-attribute-prioritizer.png" width="100%"/>
`
                }                
            },
            {
                'tooltip_1': {
                    x: 440, y: 462,
                    content: 'PriorityAttributePrioritizerを使うと、FlowFileの"priority" Attributeの値が小さいものを優先して処理します。'
                }
            },
            {
                'flow-file_0': {highlight: {attributes: ['priority']}},
                'flow-file_3': {highlight: {attributes: ['priority']}}
            },
            {
                'processor_2': {highlight: true},
                'connection_1': {
                    flowFiles: [flowFiles[1], flowFiles[2], flowFiles[4]]
                },
                'connection_2': {
                    flowFiles: [flowFiles[0], flowFiles[3]]
                }
            },
            {
                'flow-file_0': {highlight: false},
                'flow-file_3': {highlight: false},
                'flow-file_1': {highlight: {attributes: ['priority']}},
                'flow-file_4': {highlight: {attributes: ['priority']}},
                'connection_1': {
                    flowFiles: [flowFiles[2]]
                },
                'connection_2': {
                    flowFiles: [flowFiles[0], flowFiles[3], flowFiles[1], flowFiles[4]]
                },
                'tooltip_1': {
                    x: 48, y: 462, width: '400px'
                }                
            },
            {
                'flow-file_1': {highlight: false},
                'flow-file_4': {highlight: false},
                'flow-file_2': {highlight: {attributes: ['priority']}},
                'connection_1': {
                    flowFiles: []
                },
                'connection_2': {
                    flowFiles: [flowFiles[0], flowFiles[3], flowFiles[1], flowFiles[4], flowFiles[2]]
                },
                'tooltip_1': {
                    content: 'Prioritizerの設定はConnection単位です。直後のProcessorにおける順序のみ制御できるので注意してください。'
                }                
            }
        ]
    });
}