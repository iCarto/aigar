import {useState, useEffect} from "react";
import {MemberService} from "member/service";
import {LoadDataValidatorService} from "validation/service";
import {createAlertMessage, createPayment} from "payment/model";
import {getTotalErrors} from "payment/model";

export const usePaymentData = (onChangePayments, onValidateStep) => {
    const findInvoiceForPayment = (payment, invoices) => {
        let invoiceForPayment = invoices.find(
            invoice => invoice.numero === payment.num_factura
        );

        //TO-DO: Review. This will always return undefined, since payment.member_id comes from the invoice object. If no invoice is found for a payment, then this payment will only have a value for fecha, monto & num_factura. Thus payment.member_id will always be null in these cases.
        if (!invoiceForPayment) {
            invoiceForPayment = invoices.find(
                invoice => invoice.member_id === payment.member_id
            );
        }
        return invoiceForPayment;
    };

    const reviewPayments = async (payments, invoices) => {
        const numFacturaMap = new Map();
        const paymentsWithErrors = await Promise.all(
            payments?.map(async payment => {
                const invoiceForPayment = findInvoiceForPayment(payment, invoices);
                let invoiceFieldsForPayment = {};

                if (invoiceForPayment) {
                    invoiceFieldsForPayment = {
                        member_id: invoiceForPayment.member_id,
                        member_name: invoiceForPayment.nombre,
                        sector: invoiceForPayment.sector,
                        invoice: invoiceForPayment.id,
                    };
                } else {
                    // We need to get the member details for payments without invoice to avoid nulls in the table.
                    const memberId = payment.num_factura.slice(0, 4);
                    const member = await MemberService.getMember(memberId);
                    invoiceFieldsForPayment = {
                        member_id: member.id,
                        member_name: member.name,
                        sector: member.sector,
                    };
                }

                const newPayment = createPayment({
                    ...payment,
                    ...invoiceFieldsForPayment,
                    errors: LoadDataValidatorService.validatePaymentEntry(
                        payment,
                        invoiceForPayment
                    ),
                });
                if (
                    payments.find(
                        element =>
                            element.id != payment.id &&
                            element.num_factura == payment.num_factura
                    )
                ) {
                    newPayment.errors.unshift(
                        createAlertMessage(
                            "error",
                            "Hay varios pagos para el mismo recibo en el fichero bancario"
                        )
                    );
                }

                return newPayment;
            })
        );

        onChangePayments(paymentsWithErrors);
        onValidateStep(getTotalErrors(paymentsWithErrors) === 0);
    };

    return {
        reviewPayments,
    };
};
