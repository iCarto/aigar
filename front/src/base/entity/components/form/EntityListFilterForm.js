import {DomainProvider} from "aigar/domain/provider";
import {useList} from "base/entity/provider";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

const EntityListFilterForm = ({filterForm}) => {
    const {setFilter} = useList();

    const clearFilters = () => {
        setFilter({});
    };

    return (
        <DomainProvider>
            {filterForm}
            <Grid item ml={-0.5}>
                <IconButton
                    aria-label="clear-filters"
                    onClick={clearFilters}
                    title="Borrar filtros"
                >
                    <FilterAltOffIcon fontSize="small" />
                    {/* <i className="fas fa-solid fa-eraser fa-xs"></i> */}
                </IconButton>
            </Grid>
        </DomainProvider>
    );
};

export default EntityListFilterForm;
