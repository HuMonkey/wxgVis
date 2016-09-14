/**
 * Created by huwanqi on 2016/9/12.
 */
import { matrixByCities } from './util';

class Pixelmap {
    constructor(data, listener) {
        this.data = data;
        this.destroy = this.destroy.bind(this);
        this.render = this.render.bind(this);
        this.render();
    }

    destroy() {
        d3.select('.matrix svg').select('*').remove();
    }

    render() {
        const { matrix, cities } = matrixByCities(this.data);
        console.log(matrix);
        let max = 0;
        matrix.forEach((x) => {
            x.forEach((y) => {
                if(y > max) {
                    max = y;
                }
            })
        });
        const margin = {top: 0, right: 60, bottom: 0, left: 60},
            width = cities.length * 18,
            height = cities.length * 18;
        const x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
        const y = d3.scale.ordinal().rangeRoundBands([0, height], .1);
        const xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        const yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
        x.domain(cities.map((d) => d));
        y.domain(cities.map((d) => d));
        const svg = d3.select('.matrix svg')
            .style('width', width + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        const colors = ['#ffffff', '#00ff00', '#ff0000'];
        var colorScale = d3.scale.linear()
            .domain([0, 20, max])
            .range(colors);

        const group = svg.selectAll(".row")
            .data(matrix)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", (d, i) => "translate(0, " + y(cities[i]) + ")")
            .on('mouseover', function(d, i) {
                d3.select('.y.axis .tick:nth-child(' + (i + 1) + ')').attr('fill', 'red');
            })
            .on('mouseleave', function(d, i) {
                d3.select('.y.axis .tick:nth-child(' + (i + 1) + ')').attr('fill', 'black');
            })
            .selectAll(".relation")
            .data((d) => d).enter()
            .append('rect')
            .attr("class", "relation")
            .attr('width', x.rangeBand())
            .attr('height', y.rangeBand())
            .attr('x', (d, i) => x(cities[i]) - x.rangeBand())
            .attr('y', 0)
            .attr('fill', (d) => colorScale(d))
            .attr('stroke', 'width')
            .attr('stroke-width', '1px')
            .on('mouseover', function(d, i) {
                d3.select('.x.axis .tick:nth-child(' + (i + 1) + ') text').attr('fill', 'red');
            })
            .on('mouseleave', function(d, i) {
                d3.select('.x.axis .tick:nth-child(' + (i + 1) + ') text').attr('fill', 'black');
            })
            .on('click', function(d, i){
                // TODO
            })
            .append('title')
            .text((d) => d);


    }
}

export default Pixelmap;