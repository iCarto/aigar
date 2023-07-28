import {MembersFilterFormFields} from "../presentational";
import {DomainProvider} from "aigar/domain/provider";

const MembersFilterForm = ({handleFilterChange}) => {
    return (
        <DomainProvider>
            <MembersFilterFormFields handleChange={handleFilterChange} />
        </DomainProvider>
    );
};

export default MembersFilterForm;
