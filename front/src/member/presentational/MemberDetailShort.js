import {SectionField, SectionSummaryCard} from "base/ui/section/presentational";
import Grid from "@mui/material/Grid";

const MemberDetailShort = ({member}) => {
    const message = !member?.is_active ? (
        <div className="alert alert-danger">
            Este socio se encuentra eliminado del sistema.
        </div>
    ) : null;

    return (
        <SectionSummaryCard>
            {message}
            <Grid item xs={6}>
                <SectionField label="Nº socio/a" value={member?.num_socio} />
                <SectionField label="Nombre" value={member?.name} />
                <SectionField
                    label="Tipo de socio/a"
                    value={
                        member?.solo_mecha ? (
                            <strong>
                                <i className="fas fa-tint-slash mr-2" />
                                Solo mecha
                            </strong>
                        ) : (
                            <strong>
                                <i className="fas fa-tint mr-2" />
                                Conectado
                            </strong>
                        )
                    }
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Sector"
                    value={`${member?.sector} - ${member?.comunidad}`}
                />
                <SectionField label="Consumo máximo" value={member?.consumo_maximo} />
                <SectionField
                    label="Consumo reducción fija"
                    value={member?.consumo_reduccion_fija}
                />
            </Grid>
        </SectionSummaryCard>
    );
};

export default MemberDetailShort;
