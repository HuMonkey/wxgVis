/**
 * Created by huwanqi on 2016/9/12.
 */
import d3 from 'd3';

import Trade from './trade';
import City from './city';
import { groupByCities } from './util';

const GEOJSON_FILE_PATH = '../../static/data/china.geojson';
const CONTAINER = '#map-container';
const COUNTRY_FILL = '#666666';
const COUNTRY_FILL_HIGHLIGHT = '#ffffff';
const COUNTRY_STROKE = '#ffffff';
const SPOT_FILL = '';
const SPOT_STROKE = '';

let projection;

class WorldMap {
    constructor(trades, listener) {
        this.trades = trades;
        this.listener = listener;
        this.drawPrimitives = this.drawPrimitives.bind(this);
        this.render();
    }

    destroy() {
        $('#map-container svg').html('<g id="map-group"></g> <g id="primitive-group"></g>');
    }

    drawPrimitives(trades, filterBySrc) {
        d3.selectAll('#primitive-group *').remove();
        const { cities, links } = groupByCities(trades);
        try{
            const colors = ['#e5f5f9', '#99d8c9', '#2ca25f'];
            const colorScale = d3.scale.linear()
                .domain([0, 10, d3.max(links, (d) => +d.count)])
                .range(colors);
            links.forEach((link, i) => {
                new Trade(link, projection, colorScale);
            });
        } catch(e) {

        }
        try{
            cities.forEach((city, i) => {
                new City(city, projection, filterBySrc);
            });
        } catch(e) {

        }
    }

    render() {
        const { trades, drawPrimitives } = this;
        const { filterBySrc } = this.listener;
        let { width, height } = d3.select('#map-container svg').node().getBoundingClientRect();
        const svg = d3.select('#map-group');
        projection = d3.geo.mercator()
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

        drawMap.then(() => {
            drawPrimitives(trades, filterBySrc);
        }, () => {

        });
    }
}

export default WorldMap;