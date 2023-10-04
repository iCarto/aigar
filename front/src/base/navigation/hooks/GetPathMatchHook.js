import {useLocation, useResolvedPath} from "react-router-dom";

export function usePathMatch(to, resolvedPathName, resolvedSecondPathName) {
    const location = useLocation();

    const resolvedPath = useResolvedPath(resolvedPathName || to);
    const resolvedSecondPath = useResolvedPath(resolvedSecondPathName);

    const isSelected =
        location.pathname.startsWith(resolvedPath.pathname) ||
        (resolvedSecondPathName &&
            location.pathname.startsWith(resolvedSecondPath.pathname)) ||
        to === location.pathname;

    return isSelected;
}
