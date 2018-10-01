var controlPanel = {
    render: diagramSequence => {

        d3.select('#diagram-index')
            .text(`${diagramSequence.index + 1} / ${diagramSequence.actions.length}`);

        d3.select('#diagram-first')
            .on('click', () => {
                diagramSequence.index = 0;
                controlPanel.render(diagramSequence);
            })

        d3.select('#diagram-previous')
            .on('click', () => {
                diagramSequence.index = Math.max(diagramSequence.index - 1, 0);
                controlPanel.render(diagramSequence);
            })

        d3.select('#diagram-next')
            .on('click', () => {
                diagramSequence.index = Math.min(diagramSequence.index + 1, diagramSequence.actions.length - 1);
                controlPanel.render(diagramSequence);
            })

        d3.select('#diagram-last')
            .on('click', () => {
                diagramSequence.index = diagramSequence.actions.length - 1;
                controlPanel.render(diagramSequence);
            })


        diagramSequence.actions[diagramSequence.index]();
        
    }
}
