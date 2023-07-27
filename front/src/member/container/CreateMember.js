import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {DomainService} from "aigar/domain/service";
import {MemberService} from "member/service";
import {MemberForm} from "member/presentational";
import {DataValidatorService} from "validation";
import CreateMemberSidebar from "./CreateMemberSidebar";
import {createMember} from "member/model";
import {ErrorMessage} from "base/error/components";
import {PageLayout} from "base/ui/page";
import {Spinner} from "base/common";

const CreateMember = ({handleSubmit}) => {
    const [domain, setDomain] = useState({sectors: []});
    const [member, setMember] = useState(createMember());
    const [validationErrors, setValidationErrors] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [membersWithOrder, setMembersWithOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadDomains();
    }, []);

    const loadDomains = () => {
        console.log("loadDomains");
        Promise.all([DomainService.getSectors(), MemberService.getMembers()]).then(
            results => {
                const membersWithOrder = getMembersWithOrder(results[1]);
                // Add the new member to list at last position
                const orderForNewMember =
                    membersWithOrder[membersWithOrder.length - 1].order + 1;
                membersWithOrder.push({
                    id: member.num_socio,
                    order: orderForNewMember,
                    name: "<<Nuevo socio>>",
                });
                setMember(prevState =>
                    createMember(
                        Object.assign({}, prevState.member, {orden: orderForNewMember})
                    )
                );
                setDomain({sectors: results[0]});
                setMembersWithOrder(membersWithOrder);
            }
        );
    };

    const getMembersWithOrder = members => {
        let membersWithOrder = members
            .filter(member => member.is_active)
            .map(member => {
                return {
                    id: member.num_socio,
                    order: member.orden,
                    name: member.name,
                };
            });
        membersWithOrder.sort((a, b) => {
            return a.order - b.order;
        });
        return membersWithOrder;
    };

    const handleChangeOrder = (name, membersWithOrder) => {
        const orderForItem = membersWithOrder.find(
            item => item.id === member.num_socio
        ).order;
        console.log("EditMember.handleChangeOrder", name, orderForItem);
        setMember(prevState => {
            const updatedMember = createMember(
                Object.assign({}, prevState.member, {[name]: orderForItem})
            );
            return updatedMember;
        });
        // setValidationErrors(DataValidatorService.validateMember(updatedMember));
        setMembersWithOrder(membersWithOrder);
    };

    const handleChange = (name, value) => {
        console.log("CreateMember.handleChange", {name}, {value});
        setMember(prevState => {
            const updatedMember = createMember(
                Object.assign({}, prevState.member, {[name]: value})
            );
            return updatedMember;
        });
        // setValidationErrors(DataValidatorService.validateMember(updatedMember));
    };

    const handleBackAction = () => {
        navigate(-1);
    };

    const handleSubmitAction = () => {
        setIsLoading(true);
        setErrorMessage(null);
        MemberService.createMember(member)
            .then(createdMember => {
                setIsLoading(false);
                if (handleSubmit) {
                    handleSubmit(createdMember.num_socio);
                } else {
                    handleBackAction();
                }
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(
                    "Se ha producido un error y no se han podido almacenar los datos del socio"
                );
                setIsLoading(false);
            });
    };

    const sidebar = <CreateMemberSidebar />;
    const content = (
        <>
            <ErrorMessage message={errorMessage} />
            <MemberForm
                member={member}
                errors={validationErrors}
                handleChange={handleChange}
                handleSubmit={handleSubmitAction}
                sectorsDomain={domain.sectors}
                membersWithOrder={membersWithOrder}
                handleChangeOrder={handleChangeOrder}
                saving={isLoading}
            />
        </>
    );

    return (
        <PageLayout sidebar={sidebar}>
            {isLoading ? <Spinner message="Cargando datos" /> : content}
        </PageLayout>
    );
};

export default CreateMember;
