import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AigarApp} from "aigar/ui";
import {
    CreateInvoiceSubpage,
    EditInvoiceSubpage,
    ViewInvoicesPage,
    ManageInvoicesPage,
    ViewInvoiceSubpage,
} from "invoice/container";
import {InvoiceModule} from "invoice/module";
import {LoadMeasurementsWizard} from "measurement/container";
import {
    CreateMemberSubpage,
    EditMemberSubpage,
    ViewMembersPage,
    ManageMembersPage,
    ViewMemberSubpage,
} from "member/container";
import {MemberModule} from "member/module";
import {ViewMonthlyInvoicingPage} from "monthlyinvoicing/container";
import {MonthlyInvoicingModule} from "monthlyinvoicing/module";
import {LoadPaymentsWizard} from "payment/container";
import {ViewInvoicesStatsPage} from "stats/container";
import {StatsModule} from "stats/module";

export default function AigarRoutes() {
    return (
        <Router>
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
                        <Route
                            path=":num_socio/crear"
                            element={<CreateMemberSubpage />}
                        />
                        <Route path="" element={<ManageMembersPage />}>
                            <Route path="" element={<ViewMembersPage />} />
                        </Route>
                        <Route path=":num_socio" element={<ViewMemberSubpage />} />
                        <Route
                            path=":num_socio/modificar"
                            element={<EditMemberSubpage />}
                        />
                        <Route
                            path=":num_socio/nueva_factura"
                            element={<CreateInvoiceSubpage />}
                        />
                    </Route>

                    <Route path="facturas" element={<InvoiceModule />}>
                        <Route path="" element={<ManageInvoicesPage />}>
                            <Route path="" element={<ViewInvoicesPage />} />
                        </Route>
                        <Route path=":idFactura" element={<ViewInvoiceSubpage />} />
                        <Route
                            path=":idFactura/modificar"
                            element={<EditInvoiceSubpage />}
                        />
                    </Route>

                    <Route path="estadisticas" element={<StatsModule />}>
                        <Route path="" element={<ViewInvoicesStatsPage />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}
