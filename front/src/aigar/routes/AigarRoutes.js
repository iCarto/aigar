import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AigarApp} from "aigar/ui";
import {
    CreateInvoiceSubpage,
    EditInvoiceSubpage,
    ViewInvoicesPage,
    ManageInvoicesPage,
    ViewInvoiceSubpage,
} from "invoice/container";
import {
    CreateMemberSubpage,
    EditMemberSubpage,
    ViewMembersPage,
    ManageMembersPage,
    ViewMemberSubpage,
} from "member/container";
import {MonthlyInvoicingModule} from "monthlyinvoicing/module";
import {MemberModule} from "member/module";
import {InvoiceModule} from "invoice/module";
import {StatsModule} from "stats/module";
import {ViewMonthlyInvoicingPage} from "monthlyinvoicing/container";
import {ViewInvoicesStatsPage} from "stats/container";
import {LoadMeasurementsWizard} from "measurement/container";
import {LoadPaymentsWizard} from "payment/container";
import {MonthlyInvoicingListProvider} from "monthlyinvoicing/provider";

export default function AigarRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AigarApp />}>
                    <Route path="" element={<MonthlyInvoicingModule />}>
                        <Route path="" element={<ViewMonthlyInvoicingPage />} />
                        <Route
                            path="facturas_mes/:idFactura"
                            element={<ViewInvoiceSubpage />}
                        />
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
                            path=":member_id/crear"
                            element={<CreateMemberSubpage />}
                        />
                        <Route path="" element={<ManageMembersPage />}>
                            <Route path="" element={<ViewMembersPage />} />
                        </Route>
                        <Route path=":member_id" element={<ViewMemberSubpage />} />
                        <Route
                            path=":member_id/modificar"
                            element={<EditMemberSubpage />}
                        />
                        <Route
                            path=":member_id/nueva_factura"
                            element={
                                <MonthlyInvoicingListProvider>
                                    <CreateInvoiceSubpage />
                                </MonthlyInvoicingListProvider>
                            }
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
