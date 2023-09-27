import {useList} from "base/entity/provider";
import {MembersFilterFormFields} from "../presentational";
import {useDomain} from "aigar/domain/provider";

const MembersFilterForm = ({handleFilterChange}) => {
    const {filter} = useList();
    const {sectors, memberTypes, memberUseTypes} = useDomain();

    const fields = {
        num_socio: filter?.num_socio || "",
        name: filter?.name || "",
        sector: filter?.sector || "",
        status: filter?.status || "",
        tipo_uso: filter?.tipo_uso || "",
    };

    return (
        <MembersFilterFormFields
            onFieldChange={handleFilterChange}
            fields={fields}
            domains={{sectors, memberTypes, memberUseTypes}}
        />
    );
};

export default MembersFilterForm;
