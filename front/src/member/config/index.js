import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

export const MEMBER_TYPES_MAPPING = {
    Activa: {
        key: "Activa",
        label: "Activo",
        icon: <WaterDropIcon />,
    },
    Inactiva: {
        key: "Inactiva",
        label: "Inactivo",
        icon: <FormatColorResetIcon />,
    },
    con_ajuste_consumo: {
        key: "con_ajuste_consumo",
        label: "Con ajuste",
        icon: <InvertColorsIcon />,
    },
    Eliminada: {
        key: "Eliminada",
        label: "Eliminado",
        icon: <NotInterestedIcon />,
    },
};

export const MEMBER_TYPES = {
    ACTIVE: MEMBER_TYPES_MAPPING.Activa,
    INACTIVE: MEMBER_TYPES_MAPPING.Inactiva,
    DELETED: MEMBER_TYPES_MAPPING.Eliminada,
    ADJUSTED: MEMBER_TYPES_MAPPING.con_ajuste_consumo,
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
