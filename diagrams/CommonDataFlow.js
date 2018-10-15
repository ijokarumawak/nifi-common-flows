var createFlowDiagram = function() {
    var da1 = new DataObject('fa-circle', 'a1', 'データ1');
    var da2 = new DataObject('fa-circle', 'a2', 'データ2');
    var dsA = new DataSet('fa-circle', 'a', 'データセットA', [da1, da2]);

    var tbl = new DataObject('fa-table', 't1', '分析用データ');
    var dsAna = new DataSet('fa-database', 'ana', 'データ分析基盤', [tbl]);

    var db1 = new DataObject('fa-circle', 'b1', 'データ3');
    var db2 = new DataObject('fa-circle', 'b2', 'データ4');
    var dsB = new DataSet('fa-circle', 'b', 'データセットB', [db1, db2]);

    var p1 = new Processor('1', 'データ収集');
    var p2 = new Processor('2', 'データ型変換');
    var p3 = new Processor('3', 'データ加工');
    var p4 = new Processor('4', 'ルーティング');
    var p5 = new Processor('5', 'データ出力');

    var c1 = new Connection('1', '', p1, p2);
    var c2 = new Connection('2', '', p2, p3);
    var c3 = new Connection('3', '', p3, p4);
    var c4 = new Connection('4', '', p4, p5);
    

    var a1 = new Arrow('1', dsA, p1);
    var a2 = new Arrow('2', dsB, p1);
    var a3 = new Arrow('3', p5, dsAna);

    var tooltip1 = new Tooltip('1');

    return new FlowDiagram({title: 'データフローに必要な機能',
        dataSets: [dsA, dsB, dsAna],
        processors: [p1, p2, p3, p4, p5],
        connections: [c1, c2, c3, c4],
        arrows: [a1, a2, a3],
        tooltips: [tooltip1],
        actions: [
            {
                'data-set_a': { x: 30, y: 25 },
                'data-object_a1': { visible: true },
                'data-object_a2': { visible: true },
                'data-set_b': { x: 180, y: 25 },
                'data-object_b1': { visible: true },
                'data-object_b2': { visible: true },
                'data-set_ana': { x: 560, y: 480 },
                'data-object_t1': {visible: true},
                'processor_1': {visible: true, x: 150, y: 250},
                'processor_2': {visible: true, x: 250, y: 350},
                'processor_3': {visible: true, x: 350, y: 250},
                'processor_4': {visible: true, x: 450, y: 350},
                'processor_5': {visible: true, x: 550, y: 250},
                'arrow_1': {visible: true},
                'arrow_2': {visible: true},
                'arrow_3': {visible: true}
            }
        ]
    });
}