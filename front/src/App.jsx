import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import esLocale from "date-fns/locale/es";

import {AigarRoutes} from "aigar/routes";
import {theme} from "Theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                <CssBaseline>
                    <div className="App" role="application">
                        <AigarRoutes />
                    </div>
                </CssBaseline>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;
