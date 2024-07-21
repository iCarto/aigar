import UploadIcon from "@mui/icons-material/Upload";
import ListIcon from "@mui/icons-material/List";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const loadMeasurementsSteps = [
    {
        index: 1,
        text: "Cargar archivos",
        icon: <UploadIcon />,
        help: "Localice el fichero y súbalo al sistema.",
    },
    {
        index: 2,
        text: "Revisar lecturas",
        icon: <ListIcon />,
        help: "Revise los datos y corrija posibles errores.",
    },
    {
        index: 3,
        text: "Revisar recibos",
        icon: <DescriptionIcon />,
        help: "Revise los recibos con los consumos aplicados.",
    },
    {
        index: 4,
        text: "Resultado",
        icon: <CheckCircleIcon />,
        help: "Revise el resultado de la operación.",
    },
];
