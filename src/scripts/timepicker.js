/**
 * Created by huwanqi on 2016/9/13.
 */
import d3 from 'd3';

class TimePicker {
    constructor(times, listener) {
        this.times = times;
        this.selectedTime = times[0];
        this.render();
    }

    render(){
        const times = this.times;
        const timelineW = $('.timeline').width();
        const timelineH = $('.timeline').height() - 20;
        let xScale1 = d3.scale.ordinal().rangeRoundBands([0, timelineW]);
        xScale1.domain(times.map(function(d) { return d; }));
        let xAxis1 = d3.svg.axis()
            .scale(xScale1)
            .orient("bottom")
            .innerTickSize(-100)
            .outerTickSize(0);
        let brush = d3.svg.brush()
            .x(xScale1)
            .on('brushend', brushend);
        function brushend() {
            let l = brush.extent()[0];
            let r = brush.extent()[1];
            let start, end;
            if(l === r){
                start = null;
                end = null
            }else{
                let temp = data.filter(function(d){
                    return (xScale1(d.time) + xScale1.rangeBand() / 2) >= l && (xScale1(d.time) + xScale1.rangeBand() / 2) <= r;
                });
                if(temp.length === 0){
                    start = end = 0;
                }else{
                    start = temp[0].time;
                    end = temp[temp.length - 1].time;
                }
            }
            // TODO
        }
        const canvas = d3.select(".timeline svg")
            .append("g")
            .attr("transform", "translate(0, -20)");
        canvas.append("g")
            .attr('class', 'x brush')
            .call(brush)
            .selectAll('rect')
            .attr('y', 0)
            .attr('height', timelineH);
        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + timelineH + ")")
            .call(xAxis1);
    }
}

export default TimePicker;