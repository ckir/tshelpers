export function isFixedBreadth(value) {
    return value.type === 'px' || value.type === '%';
}
export function isInflexibleBreadth(value) {
    return isFixedBreadth(value) || ['min-content', 'max-content', 'auto'].includes(value.type);
}
export function isTrackBreadth(value) {
    return isInflexibleBreadth(value) || value.type === 'fr';
}
export function isAutoRepeat(value) {
    return value.type === 'auto-fill-repeat' || value.type === 'auto-fit-repeat';
}
export function isAutoFitRepeat(value) {
    return value.type === 'auto-fit-repeat';
}
export function isFixedRepeat(value) {
    return value.type === 'fix-repeat';
}
export function isAutoTrack(track) {
    return track.type === 'auto';
}
export function isFrTrack(track) {
    return track.type === 'fr';
}
export function isMinMaxTrack(track) {
    return track.type === 'minmax';
}
export function isFrMinMaxTrack(track) {
    if (isMinMaxTrack(track)) {
        const max = track.args[1];
        return max.type === 'fr';
    }
    return false;
}
export function isAutoMinMaxTrack(track) {
    if (isMinMaxTrack(track)) {
        const max = track.args[1];
        return max.type === 'auto';
    }
    return false;
}
