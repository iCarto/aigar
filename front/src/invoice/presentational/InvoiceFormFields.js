import {FormInput} from "base/form";

const InvoiceFormFields = ({formData, isReadOnly, onChange}) => {
    const isNewInvoice = formData?.id_factura.value == -1;

    const handleChangeField = event => {
        const name = event.target.name;
        const value = event.target.value;
        onChange(name, value);
    };

    return (
        <div className="row p-2 mb-3 form-inline needs-validation">
            <div className="row col-md-12 p-3">
                <div className="col-md-4 text-nowrap">
                    <FormInput
                        label="Caudal anterior"
                        name="caudal_anterior"
                        field={formData?.caudal_anterior}
                        onChange={handleChangeField}
                        readOnly={!isNewInvoice}
                        small={true}
                    />
                </div>
                <div className="col-md-4 d-inline-block">
                    <FormInput
                        label="Caudal actual"
                        name="caudal_actual"
                        field={formData?.caudal_actual}
                        onChange={handleChangeField}
                        readOnly={isReadOnly}
                        small={true}
                    />
                </div>
                <div className="col-md-4 text-nowrap">
                    <FormInput
                        label="Consumo"
                        name="consumo"
                        field={formData?.consumo}
                        onChange={handleChangeField}
                        readOnly={true}
                        small={true}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Cuota fija"
                        name="cuota_fija"
                        field={formData?.cuota_fija}
                        onChange={handleChangeField}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Cuota variable"
                        name="cuota_variable"
                        field={formData?.cuota_variable}
                        onChange={handleChangeField}
                        readOnly={!isNewInvoice}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Comisión de pago"
                        name="comision"
                        field={formData?.comision}
                        onChange={handleChangeField}
                        readOnly={!isNewInvoice}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Ahorro para mano de obra"
                        name="ahorro"
                        field={formData?.ahorro}
                        onChange={handleChangeField}
                        readOnly={!isNewInvoice}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Recargo por mora"
                        name="mora"
                        field={formData?.mora}
                        onChange={handleChangeField}
                        readOnly={isReadOnly}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Inasistencia a asambleas"
                        name="asamblea"
                        field={formData?.asamblea}
                        onChange={handleChangeField}
                        readOnly={isReadOnly}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Nuevo derecho"
                        name="derecho"
                        field={formData?.derecho}
                        onChange={handleChangeField}
                        readOnly={isReadOnly}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Re-conexión"
                        name="reconexion"
                        field={formData?.reconexion}
                        onChange={handleChangeField}
                        readOnly={isReadOnly}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Traspaso de derecho"
                        name="traspaso"
                        field={formData?.traspaso}
                        onChange={handleChangeField}
                        readOnly={isReadOnly}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Otros"
                        name="otros"
                        field={formData?.otros}
                        onChange={handleChangeField}
                        readOnly={isReadOnly}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Saldo pendiente"
                        name="saldo_pendiente"
                        field={formData?.saldo_pendiente}
                        onChange={handleChangeField}
                        readOnly={!isNewInvoice}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Descuento"
                        name="descuento"
                        field={formData?.descuento}
                        onChange={handleChangeField}
                        readOnly={isReadOnly}
                        small={true}
                    />
                </div>
                <div className="col-md-6 offset-md-3">
                    <FormInput
                        label="Total"
                        name="total"
                        field={formData?.total}
                        onChange={handleChangeField}
                        readOnly={true}
                        small={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default InvoiceFormFields;
