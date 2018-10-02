var f1_1 = new FlowFile('1', 1);
f1_1.position = { x: 20, y: 20 };
f1_1.attributes = [{name: 'a', value: 'one'}];
f1_1.content = {
    type: 'text',
    value: 'Hello World'
};
f1_1.showData = true;
f1_1.showAttributes = true;
f1_1.showContent = true;

var f1_2 = new FlowFile('1', 2);
f1_2.position = { x: 20, y: 340 };
f1_2.attributes = [{name: 'a', value: 'one'}];
f1_2.content = {
    type: 'text',
    value: 'World,one,Hello'
};
f1_2.showData = true;
f1_2.showAttributes = true;
f1_2.showContent = true;

var p1 = new Processor('1', 'ReplaceText');
p1.position = { x: 400, y: 200 };
p1.properties = [
    {
        name: 'Search Value',
        value: '([^ ]+) ([^ ]+)'
    },
    {
        name: 'Replacement Value',
        value: '$2,${a},$1'
    },
    {
        name: 'Replacement Strategy',
        value: 'RegexReplace'
    }
];
p1.showDetails = true;

var a1 = new Arrow('1', f1_1, p1);
var a2 = new Arrow('2', p1, f1_2);

var diagram = new FlowDiagram('Replace content with attribute', 0, [
    () => {
        f1_1.render();
        p1.render();
        a1.render();

        f1_2.hide();
        a2.hide();
    },
    () => {
        f1_2.render();
        a2.render();
    }
]);
diagram.render();
