import InvoiceStatusIcon from "./InvoiceStatusIcon";

const InvoiceResumenCellTable = ({value}) => {
    if (value) {
        return value.map((estado, index) => (
            <InvoiceStatusIcon key={index} estado={estado} />
        ));
    }
    return null;
};

export default InvoiceResumenCellTable;
