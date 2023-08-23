import {DateUtil} from "base/format/utilities";

const InvoiceMonthCellTable = ({item}) => {
    return (
        <div className="text-nowrap">
            {DateUtil.getMonthName(item.mes_facturado)} - {item.anho}
        </div>
    );
};

export default InvoiceMonthCellTable;
