/**
 * Created by huwanqi on 2016/9/12.
 */
import d3 from 'd3';
import { distanceBetweenTwoPoints, groupByCities } from './util';

class Trade {
    constructor(link, projection) {
        this.link = link;
        this.projection = projection;
        this.render = this.render.bind(this);
        this.render();
    }

    // render(){
    //     const { trade, src, dest } = this;
    //
    //     // line
    //     const length = distanceBetweenTwoPoints(dest, src);
    //     const middle = [(dest[0] + src[0]) / 2, (dest[1] + src[1]) / 2];
    //     svg.append('circle')
    //         .attr('cx', src[0])
    //         .attr('cy', src[1])
    //         .attr('r', 1)
    //         .attr('opacity', 0.8)
    //         .attr('fill', 'none')
    //         .attr('stroke', 'red')
    //         .attr('stroke-width', '2px')
    //         .transition()
    //         .duration(1000)
    //         .attr('r', 40)
    //         .attr('opacity', 0);
    //
    //     const drawLine = () => {
    //         const x2 = length === 0 ? 0 : src[0] + 20 / length * (dest[0] - src[0]);
    //         const y2 = length === 0 ? 0 : src[1] + 20 / length * (dest[1] - src[1]);
    //         const meteor = svg.append('line')
    //             .attr('stroke', 'red')
    //             .attr('stroke-width', '4px')
    //             .attr('opacity', 0.8)
    //             .attr('class', 'trade-line')
    //             .attr('x1', src[0])
    //             .attr('y1', src[1])
    //             .attr('x2', x2)
    //             .attr('y2', y2);
    //
    //         const x1 = length === 0 ? 0 : dest[0] - 0 / length * (dest[0] - src[0]);
    //         const y1 = length === 0 ? 0 : dest[1] - 0 / length * (dest[1] - src[1]);
    //         meteor.transition()
    //             .duration(2000).attr('x1', x1)
    //             .attr('y1', y1)
    //             .attr('x2', dest[0])
    //             .attr('y2', dest[1])
    //             .each('end', () => {
    //                 svg.append('circle')
    //                     .attr('cx', dest[0])
    //                     .attr('cy', dest[1])
    //                     .attr('r', 1)
    //                     .attr('opacity', 0.8)
    //                     .attr('fill', 'none')
    //                     .attr('stroke', 'red')
    //                     .attr('stroke-width', '2px')
    //                     .transition()
    //                     .duration(1000)
    //                     .attr('r', 40)
    //                     .attr('opacity', 0);
    //             });
    //     };
    //
    //     drawLine();
    //
    //     const makeGhost = (index) => {
    //         const x2 = length === 0 ? 0 : src[0] + 20 / length * (dest[0] - src[0]);
    //         const y2 = length === 0 ? 0 : src[1] + 20 / length * (dest[1] - src[1]);
    //         const ghost = svg.append('line')
    //             .attr('stroke', 'red')
    //             .attr('stroke-width', '4px')
    //             .attr('opacity', 0.01 * index)
    //             .attr('class', 'trade-line')
    //             .attr('x1', src[0])
    //             .attr('y1', src[1])
    //             .attr('x2', x2)
    //             .attr('y2', y2);
    //
    //         const x1 = length === 0 ? 0 : dest[0] - 0 / length * (dest[0] - src[0]);
    //         const y1 = length === 0 ? 0 : dest[1] - 0 / length * (dest[1] - src[1]);
    //         ghost.transition()
    //             .duration(2000).attr('x1', x1)
    //             .attr('y1', y1)
    //             .attr('x2', dest[0])
    //             .attr('y2', dest[1])
    //             .each('end', () => {
    //                 ghost.remove();
    //             });
    //     };
    //
    //     for(let i = 39; i >= 1; i--) {
    //         setTimeout(() => {
    //             makeGhost(i);
    //         }, 5 * (40 - i));
    //     }
    //
    // }
    
    render() {
        const svg = d3.select('#primitive-group');
        const { link, projection } = this;
        const { src_lng, src_lat, dst_lng, dst_lat, src, dst, count } = link;
        if(src_lng !== dst_lng || src_lat !== dst_lat) {
            const [sx, sy] = projection([src_lng, src_lat]);
            const [ex, ey] = projection([dst_lng, dst_lat]);
            const dr = Math.sqrt((sx - ex) * (sx - ex) + (sy - ey) * (sy - ey));
            this.path = svg.append("path").attr("class", "link")
                .attr('src', src_lng + '_' + src_lat)
                .attr('dst', dst_lng + '_' + dst_lat)
                .attr('src_city', src)
                .attr('dst_city', dst)
                .attr("d", function(){
                    return "M" + sx + "," + sy + "A" + dr + "," + dr + " 0 0, 1 " + ex + "," + ey;
                })
                .attr("fill", "none")
                .attr("stroke", 'red')
                //.style("pointer-events", "none")
                //.attr("stroke-width", weight)
                .attr("stroke-width", 3)
                .attr("opacity", 0.5)
                .on("mouseover", function(){
                    // TODO
                }).on("mouseleave", function(){
                    // TODO
                });
        } else{
            const [sx, sy] = projection([src_lng, src_lat]);
            const [ex, ey] = projection([dst_lng, dst_lat]);
            this.path = svg.append("circle").attr("class", "link")
                .attr('src', src_lng + '_' + src_lat)
                .attr('dst', dst_lng + '_' + dst_lat)
                .attr('src_city', src)
                .attr('dst_city', dst)
                .attr('cx', sx + 15)
                .attr('cy', sy + 15)
                .attr('r', 20)
                .attr("fill", "none")
                .attr("stroke", 'green')
                .attr("stroke-width", 3)
                .on("mouseover", function(){
                    // TODO
                }).on("mouseleave", function(){
                    // TODO
                });
        }
    }
    
}

export default Trade;