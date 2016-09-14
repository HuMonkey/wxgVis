/**
 * Created by hzhuwanqi on 2016/9/9.
 */
require('./index.less');
import d3 from 'd3';
import WorldMap from './src/scripts/worldmap';
import TypePicker from './src/scripts/typepicker';
import Barchart from './src/scripts/barchart';
import Pixelmap from './src/scripts/Pixelmap';

let data;
let typeArray, timeArray;
let worldMap, typePicker, barchart, pixelmap;

function render(filteredDate) {
    worldMap && worldMap.destroy();
    barchart && barchart.destroy();
    pixelmap && pixelmap.destroy();
    worldMap = new WorldMap(filteredDate);
    barchart = new Barchart(filteredDate);
    pixelmap = new Pixelmap(filteredDate);
}

function switchType(type) {
    let index = typeArray.indexOf(type);
    if(index > -1) {
        typeArray.splice(index, 1);
    } else {
        typeArray.push(type);
    }
    let filteredData = data.filter((d) => {
        return typeArray.indexOf(d.item_type) > -1;
    });
    render(filteredData);
}

d3.json('/static/data/data.txt', (array) => {
    data = array;
    typeArray = [], timeArray = [];
    data.forEach((d, i) => {
        if(typeArray.indexOf(d.item_type) === -1) {
            typeArray.push(d.item_type);
        }
        if(timeArray.indexOf(d.t_when) === -1) {
            timeArray.push(d.t_when);
        }
        d.src_city = d.src_city.substr(0, 2);
        d.src_city = d.src_city === '黑龙' ? '黑龙江' : d.src_city;
        d.dst_city = d.dst_city.substr(0, 2);
        d.dst_city = d.dst_city === '黑龙' ? '黑龙江' : d.dst_city;
    });
    typePicker = new TypePicker(typeArray, { switchType });
    render(array);
});