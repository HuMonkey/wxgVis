/**
 * Created by huwanqi on 2016/9/12.
 */
import d3 from 'd3';

class City {
    constructor(city, projection, filterBySrc) {
        this.city = city;
        this.filterBySrc = filterBySrc;
        this.projection = projection;
        this.render();
    }

    render() {
        const svg = d3.select('#primitive-group');
        const { city, projection, filterBySrc } = this;
        const [x, y] = projection([city.lng, city.lat]);
        svg.append('circle')
            .attr('class', 'city')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 5)
            .attr('fill', 'white')
            .attr('stroke', 'red')
            .attr('stroke-width', 1)
            .on('click', function() {
                d3.event.stopPropagation();
                if(window.selected) {
                    return false;
                }
                d3.selectAll('.link').attr('opacity', 0.01);
                d3.selectAll('.relation').attr('stroke', 'white');
                const row = d3.select('.row[data="' + city.city + '"]');
                d3.selectAll('.link[src="' + (city.lng + '_' + city.lat) + '"]').each(function() {
                    d3.select(this).attr('opacity', 0.9);
                    let dst = d3.select(this).attr('dst_city');
                    row.select('.relation[data="' + dst + '"]').attr('stroke', 'black');
                });
                window.selected = true;
                filterBySrc(city.city);
            }).append('title').text(city.city);
    }
}

export default City;