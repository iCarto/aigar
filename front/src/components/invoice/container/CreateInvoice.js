import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {InvoiceService, MemberService, InvoicingMonthService} from "service/api";
import {createInvoice, createInvoiceForMember, refreshInvoiceValues} from "model";
import {InvoiceForm} from "components/invoice/presentation";
import {DataValidatorService} from "service/validation";
import CreateInvoiceSidebar from "./CreateInvoiceSidebar";
import {ErrorMessage} from "components/common";

const CreateInvoice = ({onSubmit}) => {
    const [invoice, setInvoice] = useState(createInvoice());
    const [member, setMember] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [isSaving, setIsSaving] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const {num_socio} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadDataForInvoice();
    }, [num_socio]);

    const loadDataForInvoice = () => {
        setMember(null);
        setIsSaving(true);
        setErrorMessage(null);

        Promise.all([
            MemberService.getMember(num_socio),
            InvoicingMonthService.getInvoicingMonths(),
            InvoiceService.getInvoicesForMember(num_socio),
        ])
            .then(result => {
                const member = result[0];
                const invoicingMonthOpened = result[1].find(
                    invoicingMonth => invoicingMonth.is_open
                );
                const invoicesForMember = result[2].filter(
                    invoice =>
                        invoice.mes_facturacion ===
                        invoicingMonthOpened.id_mes_facturacion
                );

                setMember(member);
                setIsSaving(false);
                setInvoice(
                    createInvoiceForMember(
                        member,
                        invoicingMonthOpened,
                        invoicesForMember.length + 1
                    )
                );
            })
            .catch(error => {
                setErrorMessage(
                    "Se ha producido un error y no se han podido obtener los datos de la factura"
                );
                setIsSaving(false);
            });
    };

    const handleChange = (name, value) => {
        const invoiceDataWithNewChange = {
            ...invoice,
            [name]: value,
        };
        let updatedInvoice = createInvoice(invoiceDataWithNewChange);
        updatedInvoice = refreshInvoiceValues(
            updatedInvoice,
            member.consumo_maximo,
            member.consumo_reduccion_fija
        );

        setInvoice(updatedInvoice);
        setValidationErrors(DataValidatorService.validateInvoice(updatedInvoice));
    };

    const handleSubmit = () => {
        setIsSaving(true);
        setErrorMessage(null);

        InvoiceService.createInvoice(invoice)
            .then(createdInvoice => {
                setIsSaving(false);
                setInvoice(createdInvoice);

                if (onSubmit) {
                    onSubmit(createdInvoice.id_factura);
                } else {
                    handleBack(createdInvoice.id_factura);
                }
            })
            .catch(error => {
                console.log(error);
                setErrorMessage(
                    "Se ha producido un error y no se han podido almacenar los datos de la factura"
                );
                setIsSaving(false);
            });
    };

    const handleBack = () => {
        // if (onClickBack) {
        //     onClickBack();
        // } else if (invoice.id_factura !== -1) {
        //     navigate("/facturas/" + invoice.id_factura);
        // } else {
        //     navigate("/socios/" + num_socio);
        // }
        navigate(-1);
    };

    const sidebar = <CreateInvoiceSidebar handleBack={handleBack} />;
    const content = (
        <>
            <ErrorMessage message={errorMessage} />
            <InvoiceForm
                invoice={invoice}
                member={member}
                errors={validationErrors}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                saving={isSaving}
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

export default CreateInvoice;
