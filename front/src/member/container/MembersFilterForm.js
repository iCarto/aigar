import {useList} from "base/entity/provider";
import {MembersFilterFormFields} from "../presentational";
import {useDomain} from "aigar/domain/provider";

const MembersFilterForm = ({handleFilterChange}) => {
    const {filter} = useList();
    const {sectors, memberTypes} = useDomain();

    const fields = {
        num_socio: filter?.num_socio || "",
        name: filter?.name || "",
        sector: filter?.sector || "",
        status: filter?.status || "",
    };

    return (
        <>
            <MembersFilterFormFields
                onFieldChange={handleFilterChange}
                fields={fields}
                domains={{sectors, memberTypes}}
            />
        </>
    );
};

export default MembersFilterForm;
