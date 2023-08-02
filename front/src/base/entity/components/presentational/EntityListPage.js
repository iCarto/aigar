import {ActionsBurgerMenu} from "base/ui/menu";
import {SortedPaginatedTable} from "base/table";
import {NoItemsMessage} from "base/error/components";
import Grid from "@mui/material/Grid";

const EntityListPage = ({
    items,
    totalItems,
    columns,
    filterForm,
    pageActions = [],
    groupActions = true,
}) => {
    const displayActions = pageActions?.length > 0;
    const groupedActions = <ActionsBurgerMenu>{pageActions}</ActionsBurgerMenu>;

    return (
        <>
            <Grid item container alignItems="flex-end">
                {filterForm ? (
                    <Grid item xs={10} md={8}>
                        {filterForm}
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
                    <SortedPaginatedTable
                        columns={columns}
                        data={items}
                        totalItems={totalItems}
                    />
                ) : (
                    <NoItemsMessage itemsLength={items?.length} />
                )}
            </Grid>
        </>
    );
};

export default EntityListPage;
