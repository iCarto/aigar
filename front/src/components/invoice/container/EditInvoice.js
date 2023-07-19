import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {createInvoice, refreshInvoiceValues} from "model";
import {InvoiceService, MemberService} from "service/api";
import {Spinner, ErrorMessage} from "components/common";
import {InvoiceForm} from "components/invoice/presentation";
import {DataValidatorService} from "service/validation";
import EditInvoiceSidebar from "./EditInvoiceSidebar";

const EditInvoice = ({onSubmit = null}) => {
    const [invoice, setInvoice] = useState(null);
    const [member, setMember] = useState(null);
    const [validationErrors, setValidationErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);

    const {idFactura} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        InvoiceService.getInvoice(idFactura)
            .then(invoice => {
                setInvoice(invoice);
                MemberService.getMember(invoice.num_socio).then(member => {
                    setMember(member);
                });
            })
            .catch(error => {
                console.log(error);
                setError(
                    "Se ha producido un error y no se han podido obtener los datos de la factura"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [idFactura]);

    const handleChange = (name, value) => {
        console.log("EditInvoice.handleChange", name, value);
        const invoiceDataWithNewChange = Object.assign({}, invoice, {
            [name]: value,
        });
        let updatedInvoice = createInvoice(invoiceDataWithNewChange);
        updatedInvoice = refreshInvoiceValues(
            updatedInvoice,
            member.consumo_maximo,
            member.consumo_reduccion_fija
        );
        console.log({updatedInvoice});
        setInvoice(updatedInvoice);
        setValidationErrors(DataValidatorService.validateInvoice(updatedInvoice));
    };

    const handleSubmit = () => {
        console.log("EditMember.handleSubmit", {invoice});
        setIsLoading(true);

        InvoiceService.updateInvoice(invoice)
            .then(updatedInvoice => {
                if (onSubmit) {
                    onSubmit(updatedInvoice);
                } else {
                    handleBack();
                }
            })
            .catch(error => {
                console.log(error);
                setError(
                    "Se ha producido un error y no se han podido almacenar los datos de la factura"
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleBack = () => {
        console.log("EditInvoice.handleBack");
        navigate(-1);
    };

    const sidebar = <EditInvoiceSidebar handleBack={handleBack} invoice={invoice} />;

    const content = isLoading ? (
        <Spinner message="Cargando datos" />
    ) : (
        <>
            <ErrorMessage message={error} />
            <InvoiceForm
                invoice={invoice}
                member={member}
                errors={validationErrors}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                saving={isLoading}
            />
        </>
    );

    return (
        <div className="h-100">
            <div className="row no-gutters h-100">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    {sidebar}
                </nav>
                <div className="col-md-10 offset-md-2">
                    <div className="container">{content}</div>
                </div>
            </div>
        </div>
    );
};

export default EditInvoice;
