/**
 * Created by huwanqi on 2016/9/12.
 */
import { groupByTime } from './util';
import { colors } from './constant';

class Barchart {
    constructor(data, listener) {
        this.data = data;
        this.destroy = this.destroy.bind(this);
        this.render = this.render.bind(this);
        this.render();
    }

    destroy() {
        d3.select('.barchart-container svg').select('*').remove();
    }

    render(){
        const container = $('.barchart-container');
        const canvas = container.find('svg');
        const { data, types } = groupByTime(this.data);
        const margin = {top: 20, right: 30, bottom: 50, left: 60},
            //width = container.width() - margin.left - margin.right,
            width = data.length * types.length * 20,
            height = container.height() - margin.top - margin.bottom;
        const x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
        const x1 = d3.scale.ordinal();
        const y = d3.scale.linear()
            .range([height, height * 0.4, 0]);
        const xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");
        const yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        x0.domain(data.map(function(d) { return d.time; }));
        x1.domain(types).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, 50, d3.max(data, function(d) { return d3.max(d.types, function(d) { return d.count; }); })]);
        const svg = d3.select('.barchart-container svg')
            .style('width', width + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
            .attr("transform", function(d) { return "translate(" + x0(d.time) + ",0)"; });

        group.selectAll("rect")
            .data(function(d) { return d.types; })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.type); })
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); })
            .style("fill", function(d) { return colors(d.type); }).append('title').text(function(d) {
                return d.type + ' ' + d.count;
            });
        group.selectAll("text")
            .data(function(d) { return d.types; })
            .enter().append("text")
            .attr("x", (d) => x1(d.type) + 0.5 * x1.rangeBand())
            .attr("y", (d) => y(d.count) - 5)
            .text((d) => d.count)
            .style("fill", 'black')
            .style("text-anchor", 'middle');

        //var legend = svg.selectAll(".legend")
        //    .data(types.slice().reverse())
        //    .enter().append("g")
        //    .attr("class", "legend")
        //    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        //
        //legend.append("rect")
        //    .attr("x", width - 18)
        //    .attr("width", 18)
        //    .attr("height", 18)
        //    .style("fill", colors);
        //
        //legend.append("text")
        //    .attr("x", width - 24)
        //    .attr("y", 9)
        //    .attr("dy", ".35em")
        //    .style("text-anchor", "end")
        //    .text(function(d) { return d; });
    }
}

export default Barchart;