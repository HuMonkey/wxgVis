/**
 * Created by hzhuwanqi on 2016/9/9.
 */
require('./index.less');
import d3 from 'd3';
import WorldMap from './src/scripts/worldmap.js';

d3.json('/static/data/data.txt', (array) => {
    var worldMap = new WorldMap(array);
});