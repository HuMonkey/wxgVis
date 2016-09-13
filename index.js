/**
 * Created by hzhuwanqi on 2016/9/9.
 */
require('./index.less');
import d3 from 'd3';
import WorldMap from './src/scripts/worldmap.js';
import TypePicker from './src/scripts/typepicker.js';
import TimePicker from './src/scripts/timepicker.js';

d3.json('/static/data/data.txt', (array) => {
    var worldMap = new WorldMap(array);
    let typeArray = [], timeArray = [];
    array.forEach((d, i) => {
        if(typeArray.indexOf(d.item_type) === -1) {
            typeArray.push(d.item_type);
        }
        if(timeArray.indexOf(d.t_when) === -1) {
            timeArray.push(d.t_when);
        }
    });
    let typePicker = new TypePicker(typeArray);
    let timePicker = new TimePicker(timeArray);
});