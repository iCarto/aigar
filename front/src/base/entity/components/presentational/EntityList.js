import {Spinner} from "components/common";
import {SortedPaginatedTable} from "components/common/table";

const EntityList = ({items, columns, listView, handleChangeListView}) => {
    console.log({items});
    return items?.length ? (
        <SortedPaginatedTable
            columns={columns}
            data={items}
            listView={listView}
            handleChangeListView={handleChangeListView}
            onUpdateData={undefined}
        />
    ) : (
        <Spinner message="Cargando datos" />
    );
};

export default EntityList;
