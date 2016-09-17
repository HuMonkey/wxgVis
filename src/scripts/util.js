/**
 * Created by huwanqi on 2016/9/12.
 */
export function distanceBetweenTwoPoints(s, e) {
    return Math.sqrt((e[1] - s[1]) * (e[1] - s[1]) + (e[0] - s[0]) * (e[0] - s[0]));
}

export function matrixByCities(data) {
    let cities = [];
    data.forEach((d) => {
        if(cities.indexOf(d.src_city) === -1) {
            cities.push(d.src_city);
        }
        if(cities.indexOf(d.dst_city) === -1) {
            cities.push(d.dst_city);
        }
    });
    let matrix = cities.map((d) => {
        return cities.map((d1) => 0);
    });
    data.forEach((d) => {
        matrix[cities.indexOf(d.src_city)][cities.indexOf(d.dst_city)] += d.count;
    });
    return {
        matrix,
        cities: cities
    };
}

export function groupByTime(data) {
    let times = [];
    let types = [];
    data.forEach((d) => {
        if(times.indexOf(d.t_when) === -1) {
            times.push(d.t_when);
        }
        if(types.indexOf(d.item_type) === -1) {
            types.push(d.item_type);
        }
    });
    times.sort();
    let results = times.map((t) => {
        return {
            time: t.split('-')[1],
            types: types.map((type) => {
                return {
                    type,
                    count: 0
                }
            }),
        }
    });
    data.forEach((d) => {
        results[times.indexOf(d.t_when)].types[types.indexOf(d.item_type)].count += d.count;
    });
    return {
        data: results,
        types
    }
}

export function groupByCities(data) {
    let routes = {};
    let cities = {};
    let results = {};
    data.forEach((d) => {
        const key = d.src_city + '_' + d.dst_city;
        if(routes[key]) {
            routes[key].count += d.count;
        } else{
            routes[key] = {
                src: d.src_city,
                dst: d.dst_city,
                src_lng: d.src_longitude,
                src_lat: d.src_latitude,
                dst_lng: d.dst_longitude,
                dst_lat: d.dst_latitude,
                count: d.count,
            }
        }
        if(!cities[key]) {
            cities[key] = true;
            const src = {
                city: d.src_city,
                lng: d.src_longitude,
                lat: d.src_latitude,
            };
            results[src.city + src.lng + src.lat] = src;
            const dst = {
                city: d.dst_city,
                lng: d.dst_longitude,
                lat: d.dst_latitude,
            };
            results[dst.city + dst.lng + dst.lat] = dst;
        }
    });
    const keys = Object.keys(routes);
    const keys2 = Object.keys(results);
    return {
        cities: keys2.map((d) => results[d]),
        links: keys.map((d) => routes[d]),
    };
}