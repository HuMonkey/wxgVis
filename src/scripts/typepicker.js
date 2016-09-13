/**
 * Created by huwanqi on 2016/9/12.
 */

class TypePicker {
    constructor(types, listener) {
        this.types = types;
        this.selectedTypes = types;
        this.render();
    }

    render(){
        let html = '';
        const types = this.types;
        const selectedTypes = this.selectedTypes;
        for(let i = 0; i < types.length; i++) {
            html += '<div class="item"> ' +
                '<input type="checkbox" checked value="' + types[i] + '"/>' + types[i] + '</div>'
        }
        $('#vis-container .types').html(html);
    }
}

export default TypePicker;