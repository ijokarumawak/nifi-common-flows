class Renderable {
    constructor(id) {
        this.id = id;
    }

    getPosition() {
        return this.position;
    }

    bbox() {
        var container = document.getElementById(this.toId());
        var style = window.getComputedStyle(container);
        var height = container.scrollHeight
            + Number.parseInt(style.borderTopWidth)
            + Number.parseInt(style.borderBottomWidth);
        var width = container.scrollWidth
            + Number.parseInt(style.borderLeftWidth)
            + Number.parseInt(style.borderRightWidth);
        var p = this.getPosition();
        var box = {
                x: p.x,
                y: p.y,
                h: height,
                w: width,
                cx: p.x + (width / 2),
                cy: p.y + (height / 2)
            }
        return box;
    }

    /**
     * Calculates the point on the specified bounding box that is closest to the
     * specified point.
     *
     * @param {object} p            The starting point
     * @param {object} bbox         The bounding box
     */
    getPerimeterPoint(p, bbox) {
        // calculate theta
        var theta = Math.atan2(bbox.h, bbox.w);

        // get the rectangle radius
        var xRadius = bbox.w / 2;
        var yRadius = bbox.h / 2;

        // get the center point
        var cx = bbox.x + xRadius;
        var cy = bbox.y + yRadius;

        // calculate alpha
        var dx = p.x - cx;
        var dy = p.y - cy;
        var alpha = Math.atan2(dy, dx);

        // normalize aphla into 0 <= alpha < 2 PI
        alpha = alpha % TWO_PI;
        if (alpha < 0) {
            alpha += TWO_PI;
        }

        // calculate beta
        var beta = (Math.PI / 2) - alpha;

        // detect the appropriate quadrant and return the point on the perimeter
        if ((alpha >= 0 && alpha < theta) || (alpha >= (TWO_PI - theta) && alpha < TWO_PI)) {
            // right quadrant
            return {
                'x': bbox.x + bbox.w,
                'y': cy + Math.tan(alpha) * xRadius
            };
        } else if (alpha >= theta && alpha < (Math.PI - theta)) {
            // bottom quadrant
            return {
                'x': cx + Math.tan(beta) * yRadius,
                'y': bbox.y + bbox.h
            };
        } else if (alpha >= (Math.PI - theta) && alpha < (Math.PI + theta)) {
            // left quadrant
            return {
                'x': bbox.x,
                'y': cy - Math.tan(alpha) * xRadius
            };
        } else {
            // top quadrant
            return {
                'x': cx - Math.tan(beta) * yRadius,
                'y': bbox.y
            };
        }
    }
        
    refresh() {
        if (this.isVisible()) {
            this.render();
        } else {
            this.hide();
        }
    }

    isVisible() {
        return this.visible;
    }

    ensureContainer() {
        // Select existing ones
        var exContainer = this.selectContainer();

        // Create new ones if necessary.
        var newContainer = this.createNewContainer(exContainer);
        this.setupContainer(newContainer);
    }

    render() {
        this.ensureContainer();
        // Common rendering logic for existing and new ones.
        this.renderContainer(this.selectContainer());
    }

    getParentElementId() {
        return 'diagram-container';
    }

    selectContainer() {
        var parent = d3.select(`#${this.getParentElementId()}`);

        // Select existing ones
        var exContainer = parent
            .selectAll(`#${this.toId()}`)
            .data([this]);

        return exContainer;
    }

    hide() {
        // Delete existing ones
        var diagram = d3.select(`#${this.getParentElementId()}`);
        var exContainer = diagram
            .selectAll(`#${this.toId()}`)
            .remove();
    }

    /**
     * Subclasses should implement this method.
     * Setup new container created by d3 enter() by appending required objects.
     * @param {*} container 
     */
    setupContainer(container) {        
    }

    /**
     * Subclasses should implement this method.
     * Render container. This method is called to render both brand-new and existing container.
     * @param {*} container 
     */
    renderContainer(container) {
    }

    /**
     * Subclasses can implement class-specific highlight logic.
     * @param {*} spec 
     */
    setHighlight(spec) {
    }
}

class HTMLRenderable extends Renderable {

    constructor(id) {
        super(id);
        this.mdConverter = new showdown.Converter({tables: true});
    }

    getParentElementId() {
        return 'diagram-container';
    }

    createNewContainer(exContainer) {
        return exContainer.enter()
            .append('div')
            .attr('id', this.toId());
    }

    setDraggable(container) {
        container.call(d3.drag().on('start', () => {
            d3.event.on('drag', (d) => {
                d.position = {x: d3.event.x, y: d3.event.y};
                container.style('left', `${d.position.x}px`)
                        .style('top', `${d.position.y}px`);
            }).on('end', (d) => {
                console.log({x: d3.event.x, y: d3.event.y}, d3.event);
            });
        }))
    }
}

class SVGRenderable extends Renderable {

    getParentElementId() {
        return 'diagram-svg';
    }

    createNewContainer(exContainer) {
        return exContainer.enter()
            .append('g')
            .attr('id', this.toId());
    }
}

class RenderableContainer extends HTMLRenderable {

    constructor(id, children) {
        super(id);
        this.children = children;
    }

    isVisible() {
        return typeof this.children.find(d => d.visible) !== 'undefined';
    }

    refresh() {
        // Render parent container.
        super.refresh();
        // Then render children.
        this.children.forEach(d => d.refresh());
    }

}
