/**
 * Created by huwanqi on 2016/9/12.
 */
import { matrixByCities } from './util';

class Pixelmap {
    constructor(data, listener) {
        this.data = data;
        this.listener = listener;
        this.destroy = this.destroy.bind(this);
        this.render = this.render.bind(this);
        this.render();
    }

    destroy() {
        d3.select('.matrix svg').select('*').remove();
    }

    render() {
        const that = this;
        const { matrix, cities } = matrixByCities(this.data);
        const { filterByCities } = this.listener;
        let max = 0;
        matrix.forEach((x) => {
            x.forEach((y) => {
                if(y > max) {
                    max = y;
                }
            })
        });
        const margin = {top: 0, right: 60, bottom: 0, left: 60},
            width = cities.length * 17,
            height = cities.length * 17;
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

        const colors = ['#f0f0f0', '#bdbdbd', '#636363'];
        var colorScale = d3.scale.linear()
            .domain([0, 100, max])
            .range(colors);

        const group = svg.selectAll(".row")
            .data(matrix)
            .enter().append("g")
            .attr("class", "row")
            .attr('data', (d, i) => cities[i])
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
            .attr('data', (d, i) => cities[i])
            .attr('width', x.rangeBand())
            .attr('height', y.rangeBand())
            .attr('x', (d, i) => x(cities[i]) - x.rangeBand())
            .attr('y', 0)
            .attr('fill', (d) => colorScale(d))
            .attr('stroke', 'white')
            .attr('stroke-width', '1px')
            .on('mouseover', function(d, i) {
                if(window.selected) {
                    return false;
                }
                d3.select('.x.axis .tick:nth-child(' + (i + 1) + ') text').attr('fill', 'red');
                d3.select(this).attr('stroke', 'black');
                const src = d3.select(this.parentNode).attr('data');
                const dst = d3.select(this).attr('data');
                d3.selectAll('.link').attr('opacity', 0.01);
                d3.selectAll('.link[src_city="' + src + '"][dst_city="' + dst + '"]').attr('opacity', 0.9);
            })
            .on('mouseleave', function(d, i) {
                if(window.selected) {
                    return false;
                }
                d3.selectAll('.link').attr('opacity', 0.5);
                d3.select('.x.axis .tick:nth-child(' + (i + 1) + ') text').attr('fill', 'black');
                d3.select(this).attr('stroke', 'white');
            })
            .on('click', function(){
                d3.event.stopPropagation();
                if(d3.select(this).classed('highlight')) {
                    d3.select(this).classed('highlight', false);
                    d3.selectAll('.barchart-container .group-highlight').remove();
                    d3.select('.barchart-container .x.brush').style('pointer-events', 'all');
                    filterByCities(null, null);
                    window.selected = false;
                    return false;
                }
                if(window.selected) {
                    return false;
                }
                window.selected = true;
                d3.selectAll('.relation').classed('highlight', false);
                d3.select(this).classed('highlight', true);
                d3.select('.barchart-container .x.brush').style('pointer-events', 'none');
                const src = d3.select(this.parentNode).attr('data');
                const dest = d3.select(this).attr('data');
                filterByCities(src, dest);
                return false;
            })
            .append('title')
            .text((d) => '交易量:' + d);


    }
}

export default Pixelmap;