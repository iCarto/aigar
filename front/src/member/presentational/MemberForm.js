import {useParams} from "react-router-dom";

import {createMember} from "member/model";
import {useGetSectorReadingDay} from "aigar/domain/hooks";
import {EntityFormLayout} from "base/entity/components/form";
import {MemberFormFields} from ".";

const MemberForm = ({
    member,
    membersList,
    onUpdate,
    onUpdateMembersList,
    onSubmit,
    isSaving = false,
    error = "",
    validationErrors = [],
}) => {
    const {id: member_id} = useParams();
    const params = useParams();
    console.log(params);
    const getReadingDay = useGetSectorReadingDay;
    const isNewMember = member_id === "nuevo";

    const getFieldErrorFromProps = field => {
        const fieldErrors = validationErrors
            ? validationErrors.filter(error => error.field === field)
            : [];
        return fieldErrors.map(error => error.msg).join(<br />);
    };

    const getFormDataFromProps = () => {
        let formData = {};
        Object.keys(member).forEach(memberField => {
            formData[memberField] = {};
            formData[memberField].value = member[memberField];
            formData[memberField].errors = getFieldErrorFromProps(memberField);
        });
        return {
            ...formData,
            reading_day: {value: getReadingDay(formData.sector?.value), errors: []},
        };
    };

    const formData = getFormDataFromProps();

    const handleChange = (name, value) => {
        const updatedMember = createMember({
            ...member,
            [name]: value,
        });
        onUpdate(updatedMember);
    };

    const handleChangeOrder = updatedMembersList => {
        const orderForItem = updatedMembersList.find(
            item => item.id === member?.id
        ).order;

        const updatedMember = createMember({
            ...member,
            orden: orderForItem,
        });

        onUpdateMembersList(updatedMembersList);
        onUpdate(updatedMember);
    };

    const handleSubmit = event => {
        event.preventDefault();
        onSubmit(member);
    };

    return (
        <EntityFormLayout
            formTitle={isNewMember ? "Registrar socio/a" : "Modificar socio/a"}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            error={error}
        >
            <MemberFormFields
                formData={formData}
                members={membersList}
                onChange={handleChange}
                onChangeOrder={handleChangeOrder}
            />
        </EntityFormLayout>
    );
};
export default MemberForm;
