var controlPanel = {
    render: diagram => {

        d3.select('#diagram-index')
            .text(`${diagram.index + 1} / ${diagram.actions.length}`);

        d3.select('#diagram-first')
            .on('click', () => {
                diagram.index = 0;
                controlPanel.render(diagram);
            })

        d3.select('#diagram-previous')
            .on('click', () => {
                diagram.index = Math.max(diagram.index - 1, 0);
                controlPanel.render(diagram);
            })

        d3.select('#diagram-next')
            .on('click', () => {
                diagram.index = Math.min(diagram.index + 1, diagram.actions.length - 1);
                controlPanel.render(diagram);
            })

        d3.select('#diagram-last')
            .on('click', () => {
                diagram.index = diagram.actions.length - 1;
                controlPanel.render(diagram);
            })


        diagram.actions[diagram.index]();
        
    }
}
