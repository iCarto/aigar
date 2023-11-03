import {SortedEditableTable} from "base/table/components";
import Box from "@mui/material/Box";

const LoadDataTable = ({items, columns, onUpdateData}) => {
    const handleUpdateData = (rowIndex, id, value) => {
        onUpdateData(rowIndex, id, value);
    };

    return items?.length ? (
        <Box sx={{overflow: "auto", maxHeight: "450px"}}>
            <SortedEditableTable
                columns={columns}
                data={items}
                onUpdateData={handleUpdateData}
            />
        </Box>
    ) : null;
};

export default LoadDataTable;
