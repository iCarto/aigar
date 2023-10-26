import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {MemberService} from "member/service";
import {DataValidatorService} from "validation/service";
import {createMember} from "member/model";
import {useMembersList} from "member/provider";
import {useDomain} from "aigar/domain/provider";

import {PageLayout} from "base/ui/page";
import {MemberForm} from "member/presentational";
import {CreateMemberSidebar} from ".";

const CreateMemberSubpage = () => {
    const [member, setMember] = useState(createMember());
    const [membersList, setMembersList] = useState([]);
    const [selectedFeeValue, setSelectedFeeValue] = useState({value: 0, errors: ""});
    const [validationErrors, setValidationErrors] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const domains = useDomain();
    const {sortedMembersList, fetchMembersList} = useMembersList();

    const navigate = useNavigate();

    const maxPayment =
        member.tipo_uso === "Humano"
            ? domains.aigarConfig?.humano_nuevo_derecho_total
            : domains.aigarConfig?.comercial_nuevo_derecho_total;

    useEffect(() => {
        assignNewMemberOrder();
        setSelectedFeeValue({value: maxPayment, errors: ""});
    }, [sortedMembersList]);

    const assignNewMemberOrder = () => {
        // Assign an order to the new member and add it to the last position in the list
        const orderForNewMember =
            sortedMembersList.length > 0
                ? sortedMembersList[sortedMembersList.length - 1].order + 1
                : 1;
        const newMember = {
            id: member.id,
            order: orderForNewMember,
            name: "<<Nuevo socio>>",
        };

        const updatedMember = createMember({
            ...member,
            orden: orderForNewMember,
        });
        const updatedMembers = [...sortedMembersList, newMember];

        setMembersList(updatedMembers);
        setMember(updatedMember);
    };

    const handleUpdateForm = (updatedMember, updatedFeeValue) => {
        setValidationErrors(DataValidatorService.validateMember(updatedMember));
        setSelectedFeeValue(updatedFeeValue);
        setMember(updatedMember);
    };

    const handleUpdateMembersList = updatedList => {
        setMembersList(updatedList);
    };

    const handleSubmit = updatedMember => {
        setIsSaving(true);
        MemberService.createMember(updatedMember, selectedFeeValue.value)
            .then(createdMember => {
                fetchMembersList();
                navigate(`/socios/${createdMember.id}`);
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(
                    "Se ha producido un error y no se han podido almacenar los datos."
                );
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const sidebar = <CreateMemberSidebar />;

    return (
        <PageLayout sidebar={sidebar}>
            {membersList ? (
                <MemberForm
                    member={member}
                    membersList={membersList}
                    selectedFeeValue={selectedFeeValue}
                    domains={domains}
                    onSubmit={handleSubmit}
                    onUpdate={handleUpdateForm}
                    onUpdateMembersList={handleUpdateMembersList}
                    isSaving={isSaving}
                    error={errorMessage}
                    validationErrors={validationErrors}
                />
            ) : null}
        </PageLayout>
    );
};

export default CreateMemberSubpage;
