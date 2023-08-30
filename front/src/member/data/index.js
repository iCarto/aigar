import WaterDropIcon from "@mui/icons-material/WaterDrop"; // Conectado
import InvertColorsIcon from "@mui/icons-material/InvertColors"; // Con ajuste
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset"; // Eliminado
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

export const MEMBER_TYPES_MAPPING = {
    conectado: {
        label: "Conectado",
        icon: <WaterDropIcon />,
    },
    con_ajuste_consumo: {
        label: "Con ajuste",
        icon: <InvertColorsIcon />,
    },
    eliminado: {
        label: "Eliminado",
        icon: <FormatColorResetIcon />,
    },
};

export const USE_TYPES_MAPPING = {
    Humano: {
        label: "Humano",
        icon: <HomeRoundedIcon />,
    },
    Comercial: {
        label: "Comercial",
        icon: <StorefrontRoundedIcon />,
    },
};

export * from "./MemberInvoicesTableColumns";
