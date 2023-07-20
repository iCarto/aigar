import {AigarApp} from "aigar/ui";
import {
    CreateInvoice,
    EditInvoice,
    ManageInvoices,
    ViewInvoice,
} from "components/invoice/container";
import {InvoiceModule} from "components/invoice/module";
import {LoadMeasurementsWizard} from "components/measurements/container";
import {
    CreateMember,
    EditMember,
    ManageMembers,
    ViewMember,
} from "components/member/container";
import {MemberModule} from "components/member/module";
import {ViewMonthlyInvoicing} from "components/monthlyinvoicing/container";
import {MonthlyInvoicingModule} from "components/monthlyinvoicing/module";
import {LoadPaymentsWizard} from "components/payments/container";
import {ViewInvoicesStats} from "components/stats/container";
import {StatsModule} from "components/stats/module";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

export default function AigarRoutes() {
    return (
        <Router>
            {/* <AuthProvider> */}
            <Routes>
                <Route path="" element={<AigarApp />}>
                    <Route path="/" element={<MonthlyInvoicingModule />}>
                        <Route path="" element={<ViewMonthlyInvoicing />} />
                        <Route
                            path="/cargarpagos/:id_mes_facturacion"
                            element={<LoadPaymentsWizard />}
                        />
                        <Route
                            path="/cargarlecturas/:id_mes_facturacion"
                            element={<LoadMeasurementsWizard />}
                        />
                    </Route>

                    <Route path="/socios" element={<MemberModule />}>
                        <Route path="" element={<ManageMembers />} />
                        <Route path=":num_socio" element={<ViewMember />} />
                        <Route path=":num_socio/modificar" element={<EditMember />} />
                        <Route
                            path=":num_socio/nueva_factura"
                            element={<CreateInvoice />}
                        />
                        <Route path="nuevo" element={<CreateMember />} />
                    </Route>

                    <Route path="/facturas" element={<InvoiceModule />}>
                        <Route path="" element={<ManageInvoices />}>
                            <Route path=":idFactura" element={<ViewInvoice />} />
                            <Route
                                path=":idFactura/modificar"
                                element={<EditInvoice />}
                            />
                        </Route>
                    </Route>

                    <Route path="/estadisticas" element={<StatsModule />}>
                        <Route path="" element={<ViewInvoicesStats />} />
                    </Route>
                </Route>
            </Routes>
            {/* </AuthProvider> */}
        </Router>
    );
}
