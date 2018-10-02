let TWO_PI = 2 * Math.PI;



class Arrow extends SVGRenderable {
    constructor(id, from, to) {
        super(id);
        this.from = from;
        this.to = to;
    }

    toId() {
        return `arrow_${this.id}`;
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

    setupContainer(container) {
        container.append('path')
            .attr('marker-end', 'url(#head)')
            .attr('stroke-width', '5')
            .attr('fill', 'none')
            .attr('stroke', '#AEBAA7')
            .attr('d', d => {
                var b0 = d.from.bbox();
                var b1 = d.to.bbox();

                // Starting point
                var x0 = b0.cx;
                var y0 = b0.cy;

                // Distination point
                var p2 = this.getPerimeterPoint({x: x0, y: y0}, b1);

                return `M${x0},${y0} ${p2.x},${p2.y}`
            })
            .classed('arrow', true);
    }
}
