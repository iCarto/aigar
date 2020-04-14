import React from "react";

const InvoiceGroupFieldsCellTable = ({row}) => {
    return (
        <div className="small text-nowrap">
            {row.original.derecho !== 0 ? (
                <div className="dollar">Derecho: {row.original.derecho}</div>
            ) : null}
            {row.original.reconexion !== 0 ? (
                <div className="dollar">Re-conexión: {row.original.reconexion}</div>
            ) : null}
            {row.original.asamblea !== 0 ? (
                <div className="dollar">Asamblea: {row.original.asamblea}</div>
            ) : null}
            {row.original.traspaso !== 0 ? (
                <div className="dollar">Traspaso: {row.original.traspaso}</div>
            ) : null}
        </div>
    );
};

export default InvoiceGroupFieldsCellTable;
