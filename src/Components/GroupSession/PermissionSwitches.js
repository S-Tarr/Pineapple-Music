import {
    Switch,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    FormHelperText
} from "@mui/material";

function SwitchesGroup({permissions, setPermissions}) {
    const handleChange = (event) => {
        setPermissions({
        ...permissions,
        [event.target.name]: event.target.checked,
        });
        console.log(event.target.checked)
    };

    return (
        <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Assign Permissions</FormLabel>
        <FormGroup>
            <FormControlLabel
            control={
                <Switch checked={permissions.queueing} onChange={handleChange} name="queueing" />
            }
            label="Queueing"
            />
            <FormControlLabel
            control={
                <Switch checked={permissions.pps} onChange={handleChange} name="pps" />
            }
            label="Play/Pause"
            />
        </FormGroup>
        <FormHelperText>All permissions can be adjusted after room creation</FormHelperText>
        </FormControl>
    );
}

export default SwitchesGroup;