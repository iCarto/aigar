import {ActionsBurgerMenu} from "base/ui/menu/components";
import {SortedPaginatedSelectableTable} from "base/table/components";
import {NoItemsMessage} from "base/error/components";
import {EntityListFilterForm} from "../form";
import Grid from "@mui/material/Grid";

const EntityListPage = ({
    items,
    totalItems,
    columns,
    filterForm,
    pageActions = [],
    tableActions = [],
    groupActions = true,
    selectAttribute = "",
}) => {
    const displayActions = pageActions?.length > 0;
    const groupedActions = <ActionsBurgerMenu>{pageActions}</ActionsBurgerMenu>;

    return (
        <>
            <Grid item container alignItems="flex-end">
                {filterForm ? (
                    <Grid
                        item
                        container
                        component="form"
                        xs={10}
                        md={8}
                        flexDirection="row"
                        columnSpacing={1}
                        alignItems={"flex-end"}
                    >
                        <EntityListFilterForm filterForm={filterForm} />
                    </Grid>
                ) : null}
                {displayActions ? (
                    <Grid
                        item
                        container
                        xs={2}
                        md={4}
                        justifyContent="flex-end"
                        columnSpacing={1}
                    >
                        {groupActions
                            ? groupedActions
                            : pageActions.map((action, index) => (
                                  <Grid item key={index}>
                                      {action}
                                  </Grid>
                              ))}
                    </Grid>
                ) : null}
            </Grid>
            <Grid item>
                {items.length ? (
                    <SortedPaginatedSelectableTable
                        columns={columns}
                        data={items}
                        // totalItems={totalItems}
                        selectAttribute={selectAttribute}
                        tableActions={tableActions}
                    />
                ) : (
                    <NoItemsMessage itemsLength={items?.length} />
                )}
            </Grid>
        </>
    );
};

export default EntityListPage;
