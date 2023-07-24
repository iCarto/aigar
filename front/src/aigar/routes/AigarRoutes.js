import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AigarApp} from "aigar/ui";
import {
    CreateInvoice,
    EditInvoice,
    ListInvoicesPage,
    ManageInvoicesPage,
    ViewInvoice,
} from "invoice/container";
import {InvoiceModule} from "invoice/module";
import {LoadMeasurementsWizard} from "measurement/container";
import {
    CreateMember,
    EditMember,
    ListMembersPage,
    ManageMembersPage,
    ViewMember,
} from "member/container";
import {MemberModule} from "member/module";
import {ViewMonthlyInvoicingPage} from "monthlyinvoicing/container";
import {MonthlyInvoicingModule} from "monthlyinvoicing/module";
import {LoadPaymentsWizard} from "payment/container";
import {ViewInvoicesStats} from "stats/container";
import {StatsModule} from "stats/module";

export default function AigarRoutes() {
    return (
        <Router>
            {/* <AuthProvider> */}
            <Routes>
                <Route path="/" element={<AigarApp />}>
                    <Route path="" element={<MonthlyInvoicingModule />}>
                        <Route path="" element={<ViewMonthlyInvoicingPage />} />
                        <Route
                            path="cargarpagos/:id_mes_facturacion"
                            element={<LoadPaymentsWizard />}
                        />
                        <Route
                            path="cargarlecturas/:id_mes_facturacion"
                            element={<LoadMeasurementsWizard />}
                        />
                    </Route>

                    <Route path="socios" element={<MemberModule />}>
                        <Route path="nuevo" element={<CreateMember />} />
                        <Route path="" element={<ManageMembersPage />}>
                            <Route path="" element={<ListMembersPage />} />
                        </Route>
                        <Route path=":num_socio" element={<ViewMember />} />
                        <Route path=":num_socio/modificar" element={<EditMember />} />
                        <Route
                            path=":num_socio/nueva_factura"
                            element={<CreateInvoice />}
                        />
                    </Route>

                    <Route path="facturas" element={<InvoiceModule />}>
                        <Route path="" element={<ManageInvoicesPage />}>
                            <Route path="" element={<ListInvoicesPage />} />
                        </Route>
                        <Route path=":idFactura" element={<ViewInvoice />} />
                        <Route path=":idFactura/modificar" element={<EditInvoice />} />
                    </Route>

                    <Route path="estadisticas" element={<StatsModule />}>
                        <Route path="" element={<ViewInvoicesStats />} />
                    </Route>
                </Route>
            </Routes>
            {/* </AuthProvider> */}
        </Router>
    );
}
