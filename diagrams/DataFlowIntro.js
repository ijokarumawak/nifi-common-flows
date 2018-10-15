var createFlowDiagram = function() {
    var da1 = new DataObject('fa-circle', 'a1', 'データ1');
    var da2 = new DataObject('fa-circle', 'a2', 'データ2');
    var dsA = new DataSet('fa-circle', 'a', 'アプリAが生成', [da1, da2]);

    var tbl = new DataObject('fa-table', 't1', '分析用データ');
    var dsAna = new DataSet('fa-database', 'ana', 'データ分析基盤', [tbl]);

    var db1 = new DataObject('fa-circle', 'b1', 'データ3');
    var db2 = new DataObject('fa-circle', 'b2', 'データ4');
    var dsB = new DataSet('fa-circle', 'b', 'アプリBが生成', [db1, db2]);

    var a1 = new Arrow('1', dsA, dsAna);
    var a2 = new Arrow('2', dsB, dsAna);

    var tooltip1 = new Tooltip('1');

    return new FlowDiagram({title: 'データフローとは',
        dataSets: [dsA, dsB, dsAna],
        arrows: [a1, a2],
        tooltips: [tooltip1],
        actions: [
            {
                'tooltip_1': {
                    visible: true,
                    x: 300, y: 300,
                    content:
`
## データフローとはなんなのでしょう？
`
                }
            },
            {
                'data-set_a': { x: 200, y: 200 },
                'data-object_a1': { visible: true },
                'data-object_a2': { visible: true },
                'tooltip_1': {
                    x: 400, y: 500,
                    content:
`
## あるアプリケーションがデータを生成しているとします。
`
                }
            },
            {
                'data-set_ana': { x: 300, y: 600 },
                'data-object_t1': {visible: true},
                'tooltip_1': {
                    x: 450, y: 400,
                    content:
`
## 生成されたデータを使って分析を始めよう
`           
                }
            },
            {
                'tooltip_1': {
                    x: 450, y: 400,
                    content:
`
## 分析チーム「基盤は作ったのでデータ送ってくださーい」
## アプリAチーム 「じゃ、スクリプト書きまーす」
`           
                }
            },
            {
                'arrow_1': {visible: true}
            },
            {
                'tooltip_1': {
                    x: 450, y: 400,
                    content:
`
## 分析チーム「おお、これは良いインサイトが得られそうだが、アプリBのデータも必要だ..」
`           
                }
            },
            {
                'data-set_b': { x: 500, y: 200 },
                'data-object_b1': { visible: true },
                'data-object_b2': { visible: true }
            },
            {
                'tooltip_1': {
                    x: 450, y: 400,
                    content:
`
- 分析チーム「アプリBのデータもお願いしまーす」
- アプリBチーム 「っと、今そんな余裕ないっす。とりあえず共有ストレージに置いとくんで持ってってください！」
- 分析チーム「了解、じゃ、スクリプト書きまーす」
`           
                }
            },
            {
                'arrow_2': {visible: true}
            },
        ]
    });
}