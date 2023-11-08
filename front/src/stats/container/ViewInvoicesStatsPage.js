import {useEffect, useState} from "react";
import {InvoiceService} from "invoice/service";
import {useList} from "base/entity/provider";
import {MonthlyInvoicingListProvider} from "monthlyinvoicing/provider";
import {useFilter} from "base/filter/hooks";

import {PageLayout} from "base/ui/page";
import {NoItemsMessage} from "base/error/components";
import {Spinner} from "base/ui/other/components";
import {InvoicesStatsFilterForm, InvoicesStatsList} from ".";
import {EntityListFilterForm} from "base/entity/components/form";
import {
    InvoicesStatOpenedMonthInfo,
    InvoicesStatsFieldSelect,
} from "stats/presentational";
import Grid from "@mui/material/Grid";

const ViewInvoicesStatsPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedView, setSelectedView] = useState("monto");
    const [isLoading, setIsLoading] = useState(null);

    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();

    const views = [
        {key: "monto", text: "Monto", unit: "$", unitClass: "dollar"},
        {key: "consumo", text: "Consumo", unit: "㎥", unitClass: "cubic-metre"},
        {key: "mora", text: "Mora", unit: "$", unitClass: "dollar"},
    ];

    const displayStatsInfo = selectedView === "monto" && invoices;

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
        const filterValue = Object.values(newFilter)[0];
        if (filterValue === "") {
            const updatedFilter = {...filter};
            delete updatedFilter[Object.keys(newFilter)[0]];
            setFilter(updatedFilter);
        } else {
            setFilter(prevFilter => ({...prevFilter, ...newFilter}));
        }
    };

    const handleChangeStatsField = selectedField => {
        setSelectedView(selectedField);
    };

    return (
        <PageLayout>
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <>
                    <Grid
                        container
                        flexDirection="row"
                        columnSpacing={2}
                        justifyContent="space-between"
                        alignItems="flex-end"
                        mb={1}
                    >
                        <Grid item mt={1}>
                            <InvoicesStatsFieldSelect
                                views={views}
                                selectedView={selectedView}
                                handleChange={handleChangeStatsField}
                            />
                        </Grid>

                        <Grid item container xs={6} columnSpacing={1} component="form">
                            <EntityListFilterForm
                                filterForm={
                                    <MonthlyInvoicingListProvider>
                                        <InvoicesStatsFilterForm
                                            handleFilterChange={handleFilterChange}
                                        />
                                    </MonthlyInvoicingListProvider>
                                }
                            />
                        </Grid>

                        {displayStatsInfo ? (
                            <Grid item xs={3} mt={1}>
                                <InvoicesStatOpenedMonthInfo invoices={invoices} />
                            </Grid>
                        ) : null}
                    </Grid>

                    {filteredInvoices?.length ? (
                        <InvoicesStatsList
                            invoices={filteredInvoices}
                            views={views}
                            currentView={selectedView}
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
