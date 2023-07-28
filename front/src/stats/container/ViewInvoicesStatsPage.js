import {useEffect, useState} from "react";
import {InvoiceService} from "invoice/service";
import {useList} from "base/entity/provider";
import {useFilter} from "base/filter/hooks";
import {PageLayout} from "base/ui/page";
import {NoItemsMessage} from "base/error/components";
import {Spinner} from "base/common";
import {InvoicesStatsFilterForm, ListInvoicesStatsPage} from ".";
import Grid from "@mui/material/Grid";

const ViewInvoicesStatsPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedField, setSelectedField] = useState("monto");
    const [isLoading, setIsLoading] = useState(null);

    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();

    useEffect(() => {
        setIsLoading(true);
        InvoiceService.getInvoicesStats()
            .then(invoices => {
                setInvoices(invoices);
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        setFilteredInvoices(filterFunction(invoices));
    }, [invoices, filter]);

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({...prevFilter, ...newFilter}));
    };

    const handleChangeStatsField = selectedField => {
        setSelectedField(selectedField);
    };

    return (
        <PageLayout>
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <>
                    <Grid item container alignItems="flex-end">
                        <Grid item xs={10} md={8} sx={{zIndex: 1}}>
                            <InvoicesStatsFilterForm
                                handleFilterChange={handleFilterChange}
                            />
                        </Grid>
                    </Grid>
                    {filteredInvoices?.length ? (
                        <ListInvoicesStatsPage
                            invoices={filteredInvoices}
                            onChangeStatsField={handleChangeStatsField}
                            currentField={selectedField}
                        />
                    ) : (
                        <NoItemsMessage itemsLength={filteredInvoices?.length} />
                    )}
                </>
            )}
        </PageLayout>
    );
};

export default ViewInvoicesStatsPage;
