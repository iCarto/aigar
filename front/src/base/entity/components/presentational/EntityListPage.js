import {Fragment} from "react";
import {ActionsBurgerMenu} from "base/ui/menu/components";
import {
    SortedPaginatedSelectableTable,
    SortedPaginatedTable,
} from "base/table/components";
import {NoItemsMessage} from "base/error/components";
import {EntityListFilterForm} from "../form";
import Grid from "@mui/material/Grid";

const EntityListPage = ({
    items,
    columns,
    filterForm,
    pageActions = [],
    tableActions = [],
    groupActions = true,
    selectAttribute = "",
    onClickRows = null,
    selectedTableRows = [],
    selectable = true,
}) => {
    const displayActions = pageActions?.length > 0;
    const groupedActions = (
        <ActionsBurgerMenu>
            {pageActions.map((action, index) => (
                <Fragment key={index}>{action}</Fragment>
            ))}
        </ActionsBurgerMenu>
    );

    return (
        <>
            <Grid item container alignItems="flex-end" mb={1}>
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
                    selectable ? (
                        <SortedPaginatedSelectableTable
                            columns={columns}
                            data={items}
                            selectAttribute={selectAttribute}
                            tableActions={tableActions}
                            onClickRows={onClickRows}
                            selectedTableRows={selectedTableRows}
                        />
                    ) : (
                        <SortedPaginatedTable columns={columns} data={items} />
                    )
                ) : (
                    <NoItemsMessage itemsLength={items?.length} />
                )}
            </Grid>
        </>
    );
};

export default EntityListPage;
