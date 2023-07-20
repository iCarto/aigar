import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {MemberService, DomainService} from "service/api";
import {createMember} from "model";
import {Spinner, ErrorMessage} from "components/common";
import {MemberForm} from "components/member/presentation";
import {DataValidatorService} from "service/validation";
import EditMemberSidebar from "./EditMemberSidebar";

//TO-DO: Abstraer (see EditInvoice y crear DomainProvider)
const EditMember = ({entity, onSubmit = null}) => {
    const [domain, setDomain] = useState({
        sectors: [],
    });
    // YA ESTAMOS OBTENIENDO LOS DATOS DE MEMBER EN EL COMPONENTE PADRE, VIEWMEMBER (SE LOS PASAMOS COMO ENTITY)
    // const [member, setMember] = useState(null);
    const [validationErrors, setValidationErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState("");
    const [membersWithOrder, setMembersWithOrder] = useState([]);

    const {num_socio} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadDomains();
        loadMember();
    }, [num_socio]);

    const loadDomains = () => {
        console.log("loadDomains");
        Promise.all([DomainService.getSectors(), MemberService.getMembers()]).then(
            results => {
                const membersWithOrder = getMembersWithOrder(results[1]);
                setDomain({
                    sectors: results[0],
                });
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

    const loadMember = () => {
        setIsLoading(true);

        // MemberService.getMember(num_socio)
        //     .then(member => {
        //         setMember(member);
        //         if (!member.is_active) setError("El socio ha sido borrado.");
        //     })
        //     .catch(error => {
        //         console.log(error);
        //         setError(
        //             "Se ha producido un error y no se han podido obtener los datos del socio"
        //         );
        //     })
        //     .finally(() => {
        //         setIsLoading(false);
        //     });
    };

    const handleChangeOrder = (name, membersWithOrder) => {
        const orderForItem = membersWithOrder.find(item => item.id === num_socio).order;
        console.log("EditMember.handleChangeOrder", name, orderForItem);
        const updatedMember = createMember(
            Object.assign({}, entity, {[name]: orderForItem})
        );
        // setMember(updatedMember);
        setValidationErrors(DataValidatorService.validateMember(updatedMember));
        setMembersWithOrder(membersWithOrder);
    };

    const handleChange = (name, value) => {
        console.log("EditMember.handleChange", name, value);
        const updatedMember = createMember(Object.assign({}, entity, {[name]: value}));
        // setMember(updatedMember);
        setValidationErrors(DataValidatorService.validateMember(updatedMember));
    };

    const handleSubmit = () => {
        setIsLoading(true);
        MemberService.updateMember(entity)
            .then(updatedMember => {
                if (onSubmit) {
                    onSubmit(updatedMember);
                } else {
                    handleBack();
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

    const handleBack = () => {
        console.log("EditMember.handleBack");
        navigate(-1);
    };

    const sidebar = <EditMemberSidebar handleBack={handleBack} />;

    const content = isLoading ? (
        <Spinner message="Cargando datos" />
    ) : (
        <>
            <ErrorMessage message={error} />
            <MemberForm
                member={entity}
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
        <>
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">{sidebar}</nav>
            <div className="col-md-10 offset-md-2">
                <div className="container">{content}</div>
            </div>
        </>
    );
};

export default EditMember;
