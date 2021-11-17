import {
    Switch,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    FormHelperText
} from "@mui/material";

function SwitchesGroup({state, setState}) {
    const handleChange = (event) => {
        setState({
        ...state,
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
                <Switch checked={state.queueing} onChange={handleChange} name="queueing" />
            }
            label="Queueing"
            />
            <FormControlLabel
            control={
                <Switch checked={state.pps} onChange={handleChange} name="pps" />
            }
            label="Play/Pause"
            />
        </FormGroup>
        <FormHelperText>All permissions can be adjusted after room creation</FormHelperText>
        </FormControl>
    );
}

export default SwitchesGroup;