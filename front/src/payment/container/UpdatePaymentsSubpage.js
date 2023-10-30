import {useParams} from "react-router-dom";

import {LoadPaymentsWizard, UpdatePaymentsWizard} from ".";

const UpdatePaymentsSubpage = () => {
    const {mode: updateMode} = useParams();

    return updateMode === "cargarcsv" ? (
        <LoadPaymentsWizard />
    ) : (
        <UpdatePaymentsWizard />
    );
};

export default UpdatePaymentsSubpage;
