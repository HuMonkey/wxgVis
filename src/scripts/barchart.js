/**
 * Created by huwanqi on 2016/9/12.
 */
import { groupByTime } from './util';
import { colors } from './constant';

let xScale, xScale1, yScale;
let height;

class Barchart {
    constructor(data, listener) {
        this.data = data;
        this.destroy = this.destroy.bind(this);
        this.highlight = this.highlight.bind(this);
        this.render = this.render.bind(this);
        this.render();
    }

    destroy() {
        d3.select('.barchart-container svg').select('*').remove();
    }

    highlight(filteredData) {
        d3.selectAll('.barchart-container .group-highlight').remove();
        const { data, types } = groupByTime(filteredData);
        const svg = d3.select('.barchart-container svg > g');
        const group = svg.selectAll(".group-highlight")
            .data(data)
            .enter().append("g")
            .attr("class", "group-highlight")
            .style("opacity", 0.8)
            .attr("transform", function(d) { return "translate(" + xScale(d.time) + ",0)"; });

        group.selectAll(".bar-highlight")
            .data(function(d) { return d.types; })
            .enter().append("rect")
            .attr('class', 'bar-highlight')
            .attr("width", xScale1.rangeBand())
            .attr("x", function(d) { return xScale1(d.type); })
            .attr("y", function(d) { return yScale(d.count); })
            .attr("height", function(d) { return height - yScale(d.count); })
            .style("fill", 'red')
            .append('title').text(function(d) {
            return d.type + ' ' + d.count;
        });
        group.selectAll(".bar-text-highlight")
            .data(function(d) { return d.types; })
            .enter().append("text")
            .attr('class', 'bar-text-highlight')
            .attr("x", (d) => xScale1(d.type) + 0.5 * xScale1.rangeBand())
            .attr("y", (d) => yScale(d.count) - 5)
            .text((d) => d.count)
            .style("fill", 'black')
            .style("text-anchor", 'middle')
            .style('visibility', (d) => d.count === 0 ? 'hidden' : 'visible');
        // d3.selectAll('.barchart-container .group text').style('visibility', 'hidden');
    }

    render(){
        const container = $('.barchart-container');
        const canvas = container.find('svg');
        const { data, types } = groupByTime(this.data);
        const margin = {top: 20, right: 30, bottom: 50, left: 60};
        let width = data.length * types.length * 20;
        if( width < container.width() ) {
            width = container.width();
        }
        height = container.height() - margin.top - margin.bottom;
        xScale = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
        xScale1 = d3.scale.ordinal();
        yScale = d3.scale.linear()
            .range([height, height * 0.4, 0]);
        const xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");
        const yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        xScale.domain(data.map(function(d) { return d.time; }));
        xScale1.domain(types).rangeRoundBands([0, xScale.rangeBand()]);
        yScale.domain([0, 50, d3.max(data, function(d) { return d3.max(d.types, function(d) { return d.count; }); })]);
        const svg = d3.select('.barchart-container svg')
            .style('width', width + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let brush = d3.svg.brush()
            .x(xScale)
            .on('brushend', brushend);
        function brushend() {
            let l = brush.extent()[0];
            let r = brush.extent()[1];
            const filteredData = data.filter((d) => {
                return xScale(d.time) >= l && xScale(d.time) <= r
            });
            console.log(filteredData);
        }
        svg.append("g")
            .attr('class', 'x brush')
            .call(brush)
            .selectAll('rect')
            .attr('y', 0)
            .attr('height', height);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("交易数");

        const group = svg.selectAll(".group")
            .data(data)
            .enter().append("g")
            .attr("class", "group")
            .attr("transform", function(d) { return "translate(" + xScale(d.time) + ",0)"; });

        group.selectAll(".bar")
            .data(function(d) { return d.types; })
            .enter().append("rect")
            .attr('class', 'bar')
            .attr("width", xScale1.rangeBand() - 4)
            .attr("x", function(d) { return xScale1(d.type) + 2; })
            .attr("y", function(d) { return yScale(d.count) - 2; })
            .attr("height", function(d) { return height - yScale(d.count); })
            .attr("stroke", 'white')
            .attr("stroke-width", 2)
            .on('mouseover', function() {
                d3.select(this).attr("stroke", 'black');
            })
            .on('mouseleave', function() {
                d3.select(this).attr("stroke", 'white');
            })
            .style("fill", function(d) { return colors(d.type); }).append('title').text(function(d) {
                return d.type + ' ' + d.count;
            });
        group.selectAll(".bar-text")
            .data(function(d) { return d.types; })
            .enter().append("text")
            .attr('class', 'bar-text')
            .attr("x", (d) => xScale1(d.type) + 0.5 * xScale1.rangeBand())
            .attr("y", (d) => yScale(d.count) - 5)
            .text((d) => d.count)
            .style("fill", 'black')
            .style("text-anchor", 'middle')
            .style('visibility', (d) => d.count === 0 ? 'hidden' : 'visible');
    }
}

export default Barchart;