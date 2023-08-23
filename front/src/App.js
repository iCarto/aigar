import {AigarRoutes} from "aigar/routes";
import {theme} from "./Theme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <div className="App">
                    <AigarRoutes />
                </div>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;
