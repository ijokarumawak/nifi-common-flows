var arrow = {
    render: arrows => {
        var svg = d3.select('#diagram-svg')

        // Select existing ones
        var exContainer = svg
            .selectAll('.arrow')
            .data(arrows);

        // Create new ones
        var newContainer = exContainer.enter()
            .append('path')
            .attr('marker-end', 'url(#head)')
            .attr('stroke-width', '5')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', d => `M${d.points[0].x},${d.points[0].y} ${d.points[1].x},${d.points[1].y}`)
            .classed('arrow', true);
        
        // Remove deleted ones
        exContainer.exit().remove();
    }
}
