var f1_1 = new FlowFile('1', 1);
f1_1.position = { x: 20, y: 50 };
f1_1.attributes = [{name: 'a', value: 'one'}];
f1_1.content = {
    type: 'text',
    value: 'Hello world'
};
f1_1.showData = true;
f1_1.showAttributes = true;

var f1_2 = new FlowFile('1', 2);
f1_2.position = { x: 20, y: 440 };
f1_2.attributes = [
    {name: 'a', value: 'one'},
    {name: 'updatedAttr', value: 'ONE', highlight: true}
];
f1_2.content = {
    type: 'text',
    value: 'Hello world'
};
f1_2.showData = true;
f1_2.showAttributes = true;

var p1 = new Processor('1', 'UpdateAttribute');
p1.position = { x: 300, y: 250 };
p1.properties = [
    {
        name: 'updatedAttr',
        value: '${a:toUpper()}'
    }
];
p1.showDetails = true;

var a1 = new Arrow('1', f1_1, p1);
var a2 = new Arrow('2', p1, f1_2);

var diagram = new FlowDiagram('Update FlowFile Attribute', 0, [
    () => {
        f1_1.latest = true;
        f1_2.latest = false;
        f1_1.render();
        p1.render();
        a1.render();

        f1_2.hide();
        a2.hide();
    },
    () => {
        f1_1.latest = false;
        f1_2.latest = true;
        f1_1.render();
        f1_2.render();
        a2.render();
    }
]);
diagram.render();
