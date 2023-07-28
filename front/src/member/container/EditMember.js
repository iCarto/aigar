import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";

import {MemberService} from "member/service";
import {DomainService} from "aigar/domain/service";
import {createMember} from "member/model";
import {MemberForm} from "member/presentational";
import {DataValidatorService} from "validation";
import EditMemberSidebar from "./EditMemberSidebar";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import {PageLayout} from "base/ui/page";

//TO-DO: Abstraer (see EditInvoice y crear DomainProvider)
const EditMember = ({onSubmit = null}) => {
    const [member, setMember] = useState(null);
    const [membersWithOrder, setMembersWithOrder] = useState([]);
    const [domain, setDomain] = useState({
        sectors: [],
    });
    const [validationErrors, setValidationErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState("");

    const {num_socio} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        MemberService.getMember(num_socio).then(member => {
            setMember(member);
        });
        Promise.all([DomainService.getSectors(), MemberService.getMembers()]).then(
            results => {
                const membersWithOrder = getMembersWithOrder(results[1]);
                setDomain({
                    sectors: results[0],
                });
                setMembersWithOrder(membersWithOrder);
            }
        );
    }, [num_socio]);

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
        const orderForItem = membersWithOrder.find(item => item.id === num_socio).order;
        console.log("EditMember.handleChangeOrder", name, orderForItem);
        const updatedMember = createMember(
            Object.assign({}, member, {[name]: orderForItem})
        );
        // setMember(updatedMember);
        setValidationErrors(DataValidatorService.validateMember(updatedMember));
        setMembersWithOrder(membersWithOrder);
    };

    const handleChange = (name, value) => {
        console.log("EditMember.handleChange", name, value);
        const updatedMember = createMember(Object.assign({}, member, {[name]: value}));
        // setMember(updatedMember);
        setValidationErrors(DataValidatorService.validateMember(updatedMember));
    };

    const handleSubmit = () => {
        setIsLoading(true);
        MemberService.updateMember(member)
            .then(updatedMember => {
                if (onSubmit) {
                    onSubmit(updatedMember);
                } else {
                    navigate(-1);
                }
            })
            .catch(error => {
                console.log(error);
                setError(
                    "Se ha producido un error y no se han podido almacenar los datos del socio"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const sidebar = <EditMemberSidebar />;

    const content = isLoading ? (
        <Spinner message="Cargando datos" />
    ) : (
        <>
            <ErrorMessage message={error} />
            <MemberForm
                member={member}
                errors={validationErrors}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
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

export default EditMember;
