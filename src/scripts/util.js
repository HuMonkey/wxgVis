/**
 * Created by huwanqi on 2016/9/12.
 */
export function distanceBetweenTwoPoints(s, e) {
    return Math.sqrt((e[1] - s[1]) * (e[1] - s[1]) + (e[0] - s[0]) * (e[0] - s[0]));
};