import {SectionCard, SectionField} from "base/ui/section/presentational";
import Grid from "@mui/material/Grid";

const MemberDetail = ({member}) => {
    const getMessage = () => {
        if (!member?.is_active) {
            return (
                <div className="alert alert-danger">
                    Este usuario se encuentra eliminado del sistema.
                </div>
            );
        }
        return null;
    };

    return (
        <SectionCard cardStyle={{mt: 1, mb: 2}}>
            {getMessage()}
            <Grid container>
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
                    <SectionField
                        label="Sector"
                        value={`${member?.sector} - ${member?.comunidad}`}
                    />
                </Grid>
                <Grid item xs={6}>
                    <SectionField label="Orden" value={member?.orden} />
                    <SectionField label="Medidor" value={member?.medidor} />
                    <SectionField
                        label="Consumo máximo"
                        value={member?.consumo_maximo}
                    />
                    <SectionField
                        label="Consumo reducción fija"
                        value={member?.consumo_reduccion_fija}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SectionField label="Observaciones" value={member?.observaciones} />
                </Grid>
            </Grid>
        </SectionCard>
    );
};

export default MemberDetail;
