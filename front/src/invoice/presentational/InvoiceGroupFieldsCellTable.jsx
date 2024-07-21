import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const InvoiceGroupFieldsCellTable = ({item}) => {
    return (
        <Grid container flexDirection="column">
            {item.derecho !== 0 ? (
                <Typography variant="caption" component="span" className="dollar">
                    Derecho: {item.derecho}
                </Typography>
            ) : null}
            {item.reconexion !== 0 ? (
                <Typography variant="caption" component="span" className="dollar">
                    Re-conexión: {item.reconexion}
                </Typography>
            ) : null}
            {item.asamblea !== 0 ? (
                <Typography variant="caption" component="span" className="dollar">
                    Asamblea: {item.asamblea}
                </Typography>
            ) : null}
            {item.jornada_trabajo !== 0 ? (
                <Typography variant="caption" component="span" className="dollar">
                    Jornada trabajo: {item.jornada_trabajo}
                </Typography>
            ) : null}
            {item.traspaso !== 0 ? (
                <Typography variant="caption" component="span" className="dollar">
                    Traspaso: {item.traspaso}
                </Typography>
            ) : null}
            {item.otros !== 0 ? (
                <Typography variant="caption" component="span" className="dollar">
                    Otros: {item.otros}
                </Typography>
            ) : null}
            {item.descuento !== 0 ? (
                <Typography variant="caption" component="span" className="dollar">
                    Descuento: {item.descuento}
                </Typography>
            ) : null}
        </Grid>
    );
};

export default InvoiceGroupFieldsCellTable;
