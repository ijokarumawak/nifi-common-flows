class FlowDiagram {

    constructor(title, index, actions) {
        this.title = title;
        this.index = index;
        this.actions = actions;
    }

    render() {
        d3.select('#diagram-title')
            .text(`${this.title}`);

        d3.select('#diagram-index')
            .text(`${this.index + 1} / ${this.actions.length}`);

        d3.select('#diagram-first')
            .on('click', () => {
                this.index = 0;
                this.render();
            })

        d3.select('#diagram-previous')
            .on('click', () => {
                this.index = Math.max(this.index - 1, 0);
                this.render();
            })

        d3.select('#diagram-next')
            .on('click', () => {
                this.index = Math.min(this.index + 1, this.actions.length - 1);
                this.render();
            })

        d3.select('#diagram-last')
            .on('click', () => {
                this.index = this.actions.length - 1;
                this.render();
            })

        this.actions[this.index]();
    }
}
