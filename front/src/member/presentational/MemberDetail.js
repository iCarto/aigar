import {SectionCard, SectionField} from "base/ui/section/presentational";
import Grid from "@mui/material/Grid";

const MemberDetail = ({member}) => {
    const getMessage = () => {
        if (!member.is_active) {
            return (
                <div className="alert alert-danger">
                    Este usuario se encuentra eliminado del sistema.
                </div>
            );
        }
        return null;
    };

    if (member) {
        const {
            num_socio,
            observaciones,
            name,
            sector,
            medidor,
            solo_mecha,
            orden,
            consumo_maximo,
            consumo_reduccion_fija,
            comunidad,
        } = member;

        return (
            <SectionCard>
                {getMessage()}
                <Grid container>
                    <Grid item xs={6}>
                        <SectionField label="Nº socio/a" value={num_socio} />
                        <SectionField label="Nombre" value={name} />
                        <SectionField
                            label="Tipo de socio/a"
                            value={
                                solo_mecha ? (
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
                        <SectionField
                            label="Sector"
                            value={`${sector} - ${comunidad}`}
                        />
                        <SectionField label="Observaciones" value={observaciones} />
                    </Grid>
                    <Grid item xs={6}>
                        <SectionField label="Orden" value={orden} />
                        <SectionField label="Medidor" value={medidor} />
                        <SectionField label="Consumo máximo" value={consumo_maximo} />
                        <SectionField
                            label="Consumo reducción fija"
                            value={consumo_reduccion_fija}
                        />
                    </Grid>
                </Grid>
            </SectionCard>
        );
    }

    return null;
};

export default MemberDetail;
