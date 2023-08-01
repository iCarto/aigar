import {useParams} from "react-router-dom";

import {createMember} from "member/model";
import {DomainProvider} from "aigar/domain/provider";
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
    const {num_socio} = useParams();
    const isNewMember = num_socio === "nuevo";

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
        return formData;
    };

    const formData = getFormDataFromProps();

    const handleChange = (name, value) => {
        const updatedMember = createMember(Object.assign({}, member, {[name]: value}));
        onUpdate(updatedMember);
    };

    const handleChangeOrder = (name, updatedMembersList) => {
        const orderForItem = updatedMembersList.find(
            item => item.id === member.num_socio
        ).order;

        const updatedMember = createMember({
            ...member,
            name: orderForItem,
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
            <DomainProvider>
                <MemberFormFields
                    formData={formData}
                    members={membersList}
                    onChange={handleChange}
                    onChangeOrder={handleChangeOrder}
                />
            </DomainProvider>
        </EntityFormLayout>
    );
};
export default MemberForm;
