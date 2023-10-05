import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";

import {MemberService} from "member/service";
import {DataValidatorService} from "validation/service";
import {createMember} from "member/model";
import {useMembersList} from "member/provider";

import {PageLayout} from "base/ui/page";
import {MemberForm} from "member/presentational";
import {EditMemberSidebar} from ".";

const EditMemberSubpage = () => {
    const [member, setMember] = useState(createMember());
    const [membersList, setMembersList] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(null);

    const {sortedMembersList, fetchMembersList} = useMembersList();
    const {member_id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        MemberService.getMember(member_id).then(member => {
            setMember(member);
        });
        setMembersList(sortedMembersList);
    }, [member_id, sortedMembersList]);

    const handleSubmit = updatedMember => {
        setIsSaving(true);
        MemberService.updateMember(updatedMember)
            .then(() => {
                fetchMembersList();
                navigate(`/socios/${member_id}`);
            })
            .catch(error => {
                console.log(error);
                setError(
                    "Se ha producido un error y no se han podido almacenar los datos."
                );
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const handleUpdateForm = updatedMember => {
        setValidationErrors(DataValidatorService.validateMember(updatedMember));
        setMember(updatedMember);
    };

    const handleUpdateMembersList = updatedList => {
        setMembersList(updatedList);
    };

    const sidebar = <EditMemberSidebar />;

    return (
        <PageLayout sidebar={sidebar}>
            <MemberForm
                member={member}
                membersList={membersList}
                onSubmit={handleSubmit}
                onUpdate={handleUpdateForm}
                onUpdateMembersList={handleUpdateMembersList}
                isSaving={isSaving}
                error={error}
                validationErrors={validationErrors}
            />
        </PageLayout>
    );
};

export default EditMemberSubpage;
