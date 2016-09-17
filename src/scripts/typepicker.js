/**
 * Created by huwanqi on 2016/9/12.
 */
class TypePicker {
    constructor(types, typesColor, listener) {
        this.types = types;
        this.selectedTypes = types;
        this.typesColor = typesColor;
        this.listener = listener;
        this.render();
    }

    render(){
        let html = '';
        const types = this.types;
        const selectedTypes = this.selectedTypes;
        for(let i = 0; i < types.length; i++) {
            html += '<div class="item"> ' +
                '<input type="checkbox" checked value="' + types[i] + '"/><span style="background: ' + this.typesColor[types[i]] + '">' + types[i] + '</span></div>'
        }
        $('.types').html(html);
        const { switchType } = this.listener;
        $('.types .item input').on('click', function(ev) {
            ev.stopPropagation();
            switchType(this.value);
        });
    }
}

export default TypePicker;