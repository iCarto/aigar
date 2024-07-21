import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";

const FormRadioGroup = ({label = "", name, defaultValue, onChange, options}) => {
    const handleChange = event => {
        onChange(event);
    };

    return (
        <FormControl>
            {label ? <FormLabel id={name}>{label}</FormLabel> : null}
            <RadioGroup
                aria-labelledby={`${name}-radio-buttons-group-label`}
                defaultValue={defaultValue}
                name={name}
                onChange={handleChange}
            >
                {options.map((option, index) => (
                    <FormControlLabel
                        key={index}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default FormRadioGroup;
