import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {InvoiceService} from "service/api";
import ListInvoices from "./ListInvoices";
import ViewInvoice from "./ViewInvoice";
import "components/common/SideBar.css";

const ManageInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [listView, setListView] = useState({
        sortBy: [],
        pageIndex: 0,
    });
    const [filter, setFilter] = useState({
        numero: "",
        nombre: "",
        sector: 0,
    });
    const [filteredInvoicesIds, setFilteredInvoicesIds] = useState([]);

    const navigate = useNavigate();
    const {idFactura} = useParams();

    useEffect(() => {
        InvoiceService.getInvoices().then(invoices => {
            setInvoices(invoices);
        });
    }, []);

    console.log("ManageInvoices");

    const handleChangeListView = listView => {
        console.log("handleChangeListView", {listData: listView});
        setListView(listView);
    };

    const handleFilterChange = newFilter => {
        console.log("handleFilterChange", newFilter);
        setFilter(prevFilter => ({...prevFilter, ...newFilter}));
        setListView(prevListView => ({...prevListView, pageIndex: 0}));
    };

    const handleClickViewInvoice = (idFactura, filteredInvoicesIds) => {
        console.log("handleClickEditInvoice", idFactura, filteredInvoicesIds);
        // if (!filteredInvoicesIds) {
        //     filteredInvoicesIds = filteredInvoicesIds;
        // }
        // setSelectedInvoice(idFactura);
        setFilteredInvoicesIds(filteredInvoicesIds);
        navigate(`${idFactura}`);
    };

    const handleBackFromViewInvoice = () => {
        console.log("handleBackEditInvoice");
    };

    const handleSuccessCreateNewInvoiceVersion = (
        new_version_id_factura,
        old_version_id_factura
    ) => {
        // Replace old version id
        const updatedFilteredInvoicesIds = filteredInvoicesIds.map(invoiceId =>
            invoiceId === old_version_id_factura ? new_version_id_factura : invoiceId
        );
        setFilteredInvoicesIds(updatedFilteredInvoicesIds);
    };

    return idFactura ? (
        <ViewInvoice
            navigatorIds={filteredInvoicesIds}
            handleClickSelectInNavigator={handleClickViewInvoice}
            handleSuccessCreateNewInvoiceVersion={handleSuccessCreateNewInvoiceVersion}
            handleBack={handleBackFromViewInvoice}
        />
    ) : (
        <ListInvoices
            listView={listView}
            invoices={invoices}
            handleChangeListView={handleChangeListView}
            handleFilterChange={handleFilterChange}
            filter={filter}
        />
    );
};

export default ManageInvoices;
