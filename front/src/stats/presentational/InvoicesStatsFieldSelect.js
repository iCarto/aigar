import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

const InvoicesStatsFieldSelect = ({views, selectedView, handleChange}) => {
    const handleClick = key => {
        handleChange(key);
    };

    return (
        <ButtonGroup>
            {views.map(view => (
                <Button
                    key={view.key}
                    variant={selectedView === view.key ? "contained" : "outlined"}
                    onClick={() => handleClick(view.key)}
                >
                    {view.text}
                </Button>
            ))}
        </ButtonGroup>
    );
};

export default InvoicesStatsFieldSelect;
