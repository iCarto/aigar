import moment from "moment";
import "moment/locale/es";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AigarRoutes} from "aigar/routes";
import {theme} from "Theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale={moment.locale("es")}
            >
                <CssBaseline>
                    <div className="App">
                        <AigarRoutes />
                    </div>
                </CssBaseline>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;
