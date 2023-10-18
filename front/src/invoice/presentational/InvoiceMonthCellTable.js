import {DateUtil} from "base/format/utilities";
import Box from "@mui/material/Box";

const InvoiceMonthCellTable = ({item}) => {
    return (
        <Box flexWrap="nowrap">
            {DateUtil.getMonthName(item.mes_facturado)} - {item.anho}
        </Box>
    );
};

export default InvoiceMonthCellTable;
