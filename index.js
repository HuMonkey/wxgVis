/**
 * Created by hzhuwanqi on 2016/9/9.
 */
require('./index.less');
import d3 from 'd3';
import WorldMap from './src/scripts/worldmap';
import TypePicker from './src/scripts/typepicker';
import Barchart from './src/scripts/barchart';
import Pixelmap from './src/scripts/Pixelmap';
import { colors } from './src/scripts/constant';

let data;
let typeArray, timeArray;
let worldMap, typePicker, barchart, pixelmap;
let typesColor = {};
let count_min = 0, count_max = 0;

$('.barchart-container svg').on('click', (ev) => {
    ev.stopPropagation();
});

$('#count_min, #count_max').on('change', () => {
    count_min = $('#count_min').val();
    count_max = $('#count_max').val();
    let filteredData = data.filter((d) => {
        return commonFilter(d);
    });
    render(filteredData);
    window.selected = false;
});

$('body').on('click', function(ev) {
    let filteredData = data.filter((d) => {
        return commonFilter(d);
    });
    render(filteredData);
    window.selected = false;
});

function render(filteredData) {
    worldMap && worldMap.destroy();
    barchart && barchart.destroy();
    pixelmap && pixelmap.destroy();
    worldMap = new WorldMap(filteredData, { filterBySrc });
    barchart = new Barchart(filteredData, typesColor, { filterByTimeRange, filterByTimeAndType });
    pixelmap = new Pixelmap(filteredData, { filterByCities });
}

function highlight(filteredData) {
    barchart.highlight(filteredData);
    worldMap.drawPrimitives(filteredData);
}

function switchType(type) {
    let index = typeArray.indexOf(type);
    if(index > -1) {
        typeArray.splice(index, 1);
    } else {
        typeArray.push(type);
    }
    let filteredData = data.filter((d) => commonFilter(d));
    render(filteredData);
    window.selected = false;
}

function commonFilter(d) {
    return typeArray.indexOf(d.item_type) > -1 && +d.count >= count_min && +d.count <= count_max;
}

function filterByCities(src, dest) {
    let filteredData;
    if(src && dest) {
        filteredData = data.filter((d) => commonFilter(d) && d.src_city === src && d.dst_city === dest);
        highlight(filteredData);
    } else {
        filteredData = data.filter((d) => commonFilter(d));
        render(filteredData);
    }
}

function filterBySrc(src) {
    let filteredData;
    if(src) {
        filteredData = data.filter((d) => commonFilter(d) && d.src_city === src);
        highlight(filteredData);
    } else {
        filteredData = data.filter((d) => commonFilter(d));
        render(filteredData);
    }
}

function filterByTimeAndType(time, type) {
    let filteredData;
    if(time && type) {
        filteredData = data.filter((d) => commonFilter(d) && d.t_when.split('-')[1] === time && d.item_type === type);
    } else {
        filteredData = data.filter((d) => commonFilter(d));
    }
    worldMap && worldMap.destroy();
    pixelmap && pixelmap.destroy();
    worldMap = new WorldMap(filteredData, { filterBySrc });
    pixelmap = new Pixelmap(filteredData, { filterByCities });
}

function filterByTimeRange(start, end) {
    let filteredData;
    if(start && end) {
        filteredData = data.filter((d) => {
            const time = d.t_when.split('-')[1];
            return commonFilter(d) && time >= start && time <= end;
        });
    } else{
        filteredData = data.filter((d) => commonFilter(d));
    }
    worldMap && worldMap.destroy();
    pixelmap && pixelmap.destroy();
    worldMap = new WorldMap(filteredData, { filterBySrc });
    pixelmap = new Pixelmap(filteredData, { filterByCities });
}

d3.json('/static/data/data.txt', (array) => {
    data = array;
    typeArray = [], timeArray = [];
    data.forEach((d, i) => {
        if(+d.count > count_max) {
            count_max = +d.count;
        }
        if(+d.count < count_min) {
            count_min = +d.count;
        }
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
    typeArray.sort();
    typeArray.forEach(function(d, i) {
        typesColor[d] = colors(i);
    });
    typePicker = new TypePicker(typeArray, typesColor, { switchType });
    $("#count_max").val(count_max);
    $("#count_min").val(count_min);
    render(array);
});