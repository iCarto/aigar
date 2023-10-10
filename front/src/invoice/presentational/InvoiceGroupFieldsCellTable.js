const InvoiceGroupFieldsCellTable = ({item}) => {
    return (
        <div className="small text-nowrap">
            {item.derecho !== 0 ? (
                <div className="dollar">Derecho: {item.derecho}</div>
            ) : null}
            {item.reconexion !== 0 ? (
                <div className="dollar">Re-conexión: {item.reconexion}</div>
            ) : null}
            {item.asamblea !== 0 ? (
                <div className="dollar">Asamblea: {item.asamblea}</div>
            ) : null}
            {item.jornada_trabajo !== 0 ? (
                <div className="dollar">Jornada trabajo: {item.jornada_trabajo}</div>
            ) : null}
            {item.traspaso !== 0 ? (
                <div className="dollar">Traspaso: {item.traspaso}</div>
            ) : null}
            {item.otros !== 0 ? (
                <div className="dollar">Otros: {item.otros}</div>
            ) : null}
            {item.descuento !== 0 ? (
                <div className="dollar">Descuento: {item.descuento}</div>
            ) : null}
        </div>
    );
};

export default InvoiceGroupFieldsCellTable;
