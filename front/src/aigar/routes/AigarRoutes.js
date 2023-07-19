import {AigarApp} from "aigar/ui";
import {LoadDataWizard} from "components/common/loaddata/wizard";
import {
    CreateInvoice,
    EditInvoice,
    ManageInvoices,
    ViewInvoice,
} from "components/invoice/container";
import {LoadMeasurementsWizard} from "components/measurements/container";
import {
    CreateMember,
    EditMember,
    ManageMembers,
    ViewMember,
} from "components/member/container";
import {ViewMonthlyInvoicing} from "components/monthlyinvoicing/container";
import {MonthlyInvoicingModule} from "components/monthlyinvoicing/module";
import {LoadPaymentsWizard} from "components/payments/container";
import {ViewInvoicesStats} from "components/stats/container";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

export default function AigarRoutes() {
    return (
        <Router>
            {/* <AuthProvider> */}
            <Routes>
                <Route path="" element={<AigarApp />}>
                    {/* <Route path="/" element={<MonthlyInvoicingModule />}> */}
                    <Route path="/" element={<ViewMonthlyInvoicing />}>
                        <Route path=":idFactura" element={<ViewInvoice />} />
                        <Route path=":idSocio" element={<ViewMember />} />
                    </Route>
                    <Route
                        path="/cargarpagos/:id_mes_facturacion"
                        element={
                            <LoadDataWizard>
                                <LoadPaymentsWizard />
                            </LoadDataWizard>
                        }
                    />
                    <Route
                        path="/cargarlecturas/:id_mes_facturacion"
                        element={
                            <LoadDataWizard>
                                <LoadMeasurementsWizard />
                            </LoadDataWizard>
                        }
                    />
                    {/* </Route> */}
                    <Route
                        path="/socios/:num_socio/modificar"
                        element={<EditMember />}
                    />
                    <Route path="/socios/nuevo" element={<CreateMember />} />
                    <Route
                        path="/socios/:num_socio/nueva_factura"
                        element={<CreateInvoice />}
                    />
                    <Route path="/socios/:num_socio" element={<ViewMember />} />
                    <Route path="/socios" element={<ManageMembers />} />
                    <Route
                        path="/facturas/:idFactura/modificar"
                        element={<EditInvoice />}
                    />
                    <Route path="/facturas" element={<ManageInvoices />}>
                        <Route path=":idFactura" element={<ViewInvoice />} />
                    </Route>
                    <Route path="/estadisticas" element={<ViewInvoicesStats />} />
                </Route>
            </Routes>
            {/* </AuthProvider> */}
        </Router>
    );
}
