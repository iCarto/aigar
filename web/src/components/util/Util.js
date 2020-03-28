const Util = {
    debounce(a, b, c) {
        var d, e;
        return function() {
            function h() {
                return (d = null), c || (e = a.apply(f, g));
            }
            var f = this,
                g = arguments;
            return (
                clearTimeout(d),
                (d = setTimeout(h, b)),
                c && !d && (e = a.apply(f, g)),
                e
            );
        };
    },
};
export default Util;
