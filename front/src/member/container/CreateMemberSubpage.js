import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {MemberService} from "member/service";
import {DataValidatorService} from "validation";
import {createMember} from "member/model";
import {useMembersList} from "member/provider";

import {PageLayout} from "base/ui/page";
import {MemberForm} from "member/presentational";
import {CreateMemberSidebar} from ".";

const CreateMemberSubpage = () => {
    const [member, setMember] = useState(createMember());
    const [membersList, setMembersList] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const {sortedMembersList} = useMembersList();
    const navigate = useNavigate();

    useEffect(() => {
        assignNewMemberOrder();
    }, [sortedMembersList]);

    const assignNewMemberOrder = () => {
        // Assign an order to the new member and add it to the last position in the list
        const orderForNewMember =
            sortedMembersList.length > 0
                ? sortedMembersList[sortedMembersList.length - 1].order + 1
                : 1;
        const newMember = {
            id: member.num_socio,
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

    const handleUpdateForm = updatedMember => {
        setValidationErrors(DataValidatorService.validateMember(updatedMember));
        setMember(updatedMember);
    };

    const handleUpdateMembersList = updatedList => {
        setMembersList(updatedList);
    };

    const handleSubmit = updatedMember => {
        setIsSaving(true);
        MemberService.createMember({updatedMember})
            .then(createdMember => {
                navigate(`/socios/${createdMember.num_socio}`);
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
            <MemberForm
                member={member}
                membersList={membersList}
                onSubmit={handleSubmit}
                onUpdate={handleUpdateForm}
                onUpdateMembersList={handleUpdateMembersList}
                isSaving={isSaving}
                error={errorMessage}
                validationErrors={validationErrors}
            />
        </PageLayout>
    );
};

export default CreateMemberSubpage;
