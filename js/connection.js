class Connection extends RenderableContainer {

    constructor(id, name, pIn, pOut) {
        super(id, []);
        this.arrow = new Arrow(this.toId(), pIn, pOut);
        this.name = name;
        this.pIn = pIn;
        this.pOut = pOut;
        this.flowFiles = [];
        this.position = {x: 0, y: 0};
    }

    toId() {
        return `connection_${this.id}`;
    }

    isVisible() {
        return this.pIn.isVisible() && this.pOut.isVisible();
    }

    setContainerPosition(container, transition) {
        var b0 = this.bbox();

        var b1 = this.pIn.bbox();
        var b2 = this.pOut.bbox();

        var p1 = this.getPerimeterPoint({x: b1.cx, y: b1.cy}, b2);
        var p2 = this.getPerimeterPoint({x: b2.cx, y: b2.cy}, b1);

        var containerTransition = transition ? container.transition() : container;
        containerTransition
            .style('left', `${((p1.x + p2.x) / 2) - b0.cx}px`)
            .style('top', `${((p1.y + p2.y) / 2) - b0.cy}px`);
    }

    setupContainer(container) {
        container
            .classed('connection', true)
            .append('div')
            .classed('connection-name', true)
            .text(d => d.name);

        this.setContainerPosition(container, false);
    }

    renderContainer(container) {
        this.setContainerPosition(container, true);

        this.arrow.visible = true;
        this.arrow.render();
    }

    hide() {
        super.hide();
        this.arrow.hide();
    }

    setFlowFiles(_flowFiles) {
        var connectionId = this.toId();
        // Unlink all.
        this.flowFiles.forEach(f => {
            f.queued = false;
            f.connectionId = undefined;
        });
        // Link new.
        _flowFiles.forEach(f => {
            f.queued = true;
            f.connectionId = connectionId;
        });
        this.flowFiles = _flowFiles;
    }
}
