/**
 * Created by huwanqi on 2016/9/12.
 */
import d3 from 'd3';

import Trade from './trade';

const GEOJSON_FILE_PATH = '../../static/data/china.geojson';
const CONTAINER = '#map-container';
const COUNTRY_FILL = '#666666';
const COUNTRY_FILL_HIGHLIGHT = '#ffffff';
const COUNTRY_STROKE = '#ffffff';
const SPOT_FILL = '';
const SPOT_STROKE = '';

class WorldMap {
    constructor(trades) {
        this.trades = trades;
        this.destroy = this.destroy.bind(this);
        this.render = this.render.bind(this);
        this.render();
    }

    destroy() {
        $('#map-container svg').html('<g id="map-group"></g> <g id="primitive-group"></g>');
    }

    render() {
        const trades = this.trades;
        let { width, height } = d3.select('#map-container svg').node().getBoundingClientRect();
        const svg = d3.select('#map-group');
        let projection = d3.geo.mercator()
            .center([107, 38])
            .scale(height)
            .translate([width / 2, height / 2]);
        let path = d3.geo.path()
            .projection(projection);

        // 画地图
        let drawMap = new Promise((res, rej) => {
            d3.json(GEOJSON_FILE_PATH, (err, root) => {
                if(err) {
                    console.error(error);
                    rej(err);
                }
                svg.selectAll(".country")
                    .data( root.features )
                    .enter()
                    .append("path")
                    .attr("class", "country")
                    .attr("stroke", COUNTRY_STROKE)
                    .attr("stroke-width",1)
                    .attr("fill", COUNTRY_FILL)
                    .attr("fill-opacity", 1)
                    .attr("d", path);
                res();
            });
        });

        // 画点
        let drawPoints = drawMap.then(() => {
            return new Promise((res, rej) => {
                try{
                    let primitives = [];
                    trades.sort((a, b) => a.t_when > b.t_when);
                    trades.forEach((trade, i) => {
                        const src_loc = [trade.src_longitude, trade.src_latitude];
                        const dest_loc = [trade.dst_longitude, trade.dst_latitude];
                        const src_coor = projection(src_loc);
                        const des_coor = projection(dest_loc);
                        primitives.push(new Trade(trade, src_coor, des_coor));
                    });
                    res();
                } catch(e) {
                    rej(e);
                }
            });
        }, () => {

        });
    }
}

export default WorldMap;