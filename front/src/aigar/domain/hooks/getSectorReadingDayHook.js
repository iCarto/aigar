import {useEffect, useState} from "react";
import {useDomain} from "../provider";

const useGetSectorReadingDay = sectorName => {
    const [selectedReadingDay, setSelectedReadingDay] = useState("");
    const {readingDays} = useDomain();

    useEffect(() => {
        if (readingDays.length) {
            const readingDay = readingDays.find(
                readingDay => readingDay.key === sectorName
            );
            if (readingDay) setSelectedReadingDay(readingDay.value);
        }
    }, [sectorName, readingDays]);

    return selectedReadingDay;
};

export default useGetSectorReadingDay;
