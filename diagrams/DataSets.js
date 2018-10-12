var createFlowDiagram = function() {
    var tbl1 = new DataObject('fa-table', '1', 'Table A');
    var tbl2 = new DataObject('fa-table', '2', 'Table B');
    tbl1.content = `

| h1    |    h2   |      h3 |
|:------|:-------:|--------:|
| 100   | [a][1]  | ![b][2] |
| *foo* | **bar** | ~~baz~~ |
    
`;
    var ds1 = new DataSet('fa-database', '1', 'A database', [tbl1, tbl2]);

    var file1 = new DataObject('fa-file', '3', 'File 1');
    var file2 = new DataObject('fa-file', '4', 'File 2');
    var ds2 = new DataSet('fa-folder', '2', 'FTP Server', [file1, file2])

    return new FlowDiagram({title: 'Prioritizers',
        dataSets: [ds1, ds2],
        actions: [
            {
                'data-set_1': {
                    x: 200, y: 200
                },
                'data-object_1': {
                    visible: true,
                    showContent: true
                }
            },
            {
                'data-object_2': {
                    visible: true
                }
            },
            {
                'data-set_2': {
                    x: 500, y: 300
                },
                'data-object_3': {
                    visible: true
                },
                'data-object_4': {
                    visible: true                    
                }
            }
        ]
    });
}