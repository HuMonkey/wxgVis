/**
 * Created by huwanqi on 2016/9/12.
 */
import d3 from 'd3';
const svg = d3.select('#primitive-group');
import { distanceBetweenTwoPoints } from './util';

class Trade {
    constructor(trade, src, dest) {
        this.trade = trade;
        this.src = src;
        this.dest = dest;
        this.render();
    }

    render(){
        const { trade, src, dest } = this;

        // path
        //svg.append('path')
        //    .transition()
        //    .duration(3000)
        //    .attr('opacity', 0.2)
        //    .attr('stroke', 'red')
        //    .attr('stroke-width', '2px')
        //    .attr('d', 'M' + src[0] + ' ' + src[1] + 'L' + dest[0] + ' ' + dest[1]);

        // line
        const length = distanceBetweenTwoPoints(dest, src);
        const middle = [(dest[0] + src[0]) / 2, (dest[1] + src[1]) / 2];
        const meteor = svg.append('line')
            .attr('stroke', 'red')
            .attr('stroke-width', '4px')
            .attr('x1', src[0])
            .attr('y1', src[1])
            .attr('x2', src[0] + 20 / length * (dest[0] - src[0]))
            .attr('y2', src[1] + 20 / length * (dest[1] - src[1]));

        meteor.transition()
            .duration(2000)
            .ease((t) => {
                return 1 - Math.sqrt(1 - t * t); // circle
                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
            })
            .attr('x1', dest[0] - 40 / length * (dest[0] - src[0]))
            .attr('y1', dest[1] - 40 / length * (dest[1] - src[1]))
            .attr('x2', dest[0])
            .attr('y2', dest[1]);

        // circle with transition
        //const primitive = svg.append('circle')
        //    .attr('cx', src[0])
        //    .attr('cy', src[1])
        //    .attr('r', 6)
        //    .attr('opacity', 0.8)
        //    .attr('fill', 'white')
        //    .attr('stroke', 'black');
        //primitive
        //    .transition()
        //    .duration(3000)
        //    .attr('cx', dest[0])
        //    .attr('cy', dest[1]);
        //
        //setTimeout(() => {
        //    primitive.transition()
        //        .duration(3000)
        //        .attr('opacity', 0);
        //}, 4000);



    }
}

export default Trade;