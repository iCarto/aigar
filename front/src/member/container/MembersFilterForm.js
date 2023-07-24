import {MembersFilterFormFields} from "../presentational";
import {DomainProvider} from "aigar/domain/provider";

const MembersFilterForm = ({filter, handleFilterChange}) => {
    return (
        <DomainProvider>
            <MembersFilterFormFields
                filter={filter}
                handleChange={handleFilterChange}
            />
        </DomainProvider>
    );
};

export default MembersFilterForm;
