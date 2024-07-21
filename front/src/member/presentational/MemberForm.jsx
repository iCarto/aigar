import {createMember} from "member/model";
import {useGetSectorReadingDay} from "aigar/domain/hooks";
import {EntityFormLayout} from "base/entity/components/form";
import {MemberFormFields} from ".";

const MemberForm = ({
    member,
    membersList,
    selectedFeeValue = null,
    domains,
    onUpdate,
    onUpdateMembersList,
    onSubmit,
    isSaving = false,
    error = "",
    validationErrors = [],
}) => {
    const isNewMember = member?.id === -1;

    const getReadingDay = useGetSectorReadingDay;

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
            reading_day: {value: getReadingDay(formData.sector?.value), errors: ""},
            selected_fee_value: selectedFeeValue,
        };
    };

    const formData = getFormDataFromProps();

    const handleChange = (name, value) => {
        const updatedMember = createMember({
            ...member,
            [name]: value,
        });
        const updatedFeeValue = getSelectedFeeValue(name, value);
        onUpdate(updatedMember, updatedFeeValue);
    };

    const handleChangeOrder = updatedMembersList => {
        const orderForItem = updatedMembersList.find(
            item => item.id === member?.id
        ).order;

        const updatedMember = createMember({
            ...member,
            orden: orderForItem,
        });
        const selectedFeeValue = getSelectedFeeValue();
        onUpdateMembersList(updatedMembersList);
        onUpdate(updatedMember, selectedFeeValue);
    };

    const handleSubmit = event => {
        event.preventDefault();
        onSubmit(member);
    };

    const getSelectedFeeValue = (name, value) => {
        let updatedFeeValue = formData.selected_fee_value;
        if (name === "selected_fee_value")
            updatedFeeValue = {value: parseInt(value), errors: ""};
        return updatedFeeValue;
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
                isNewMember={isNewMember}
                members={membersList}
                onChange={handleChange}
                onChangeOrder={handleChangeOrder}
                domains={domains}
            />
        </EntityFormLayout>
    );
};
export default MemberForm;
