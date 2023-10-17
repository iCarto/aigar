import {SortedEditableTable} from "base/table/components";
import Box from "@mui/material/Box";

const LoadDataTable = ({items, columns, onUpdateData}) => {
    return items?.length ? (
        <Box sx={{overflow: "auto", maxHeight: "450px"}}>
            <SortedEditableTable
                columns={columns}
                data={items}
                onUpdateData={onUpdateData}
            />
        </Box>
    ) : null;
};

export default LoadDataTable;
