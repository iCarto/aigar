import {ActionsBurgerMenu} from "base/ui/menu";
import {Spinner} from "base/common";
import {SortedPaginatedTable} from "base/table";
import Grid from "@mui/material/Grid";

const EntityListPage = ({
    items,
    columns,
    filterForm,
    pageActions = [],
    listView,
    handleChangeListView = null,
    groupActions = true,
}) => {
    const displayActions = pageActions?.length > 0;
    const groupedActions = <ActionsBurgerMenu>{pageActions}</ActionsBurgerMenu>;

    return items?.length ? (
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
                <SortedPaginatedTable
                    columns={columns}
                    data={items}
                    listView={listView}
                    handleChangeListView={handleChangeListView}
                    onUpdateData={undefined}
                />
            </Grid>
        </>
    ) : (
        <Spinner message="Cargando datos" />
    );
};

export default EntityListPage;
