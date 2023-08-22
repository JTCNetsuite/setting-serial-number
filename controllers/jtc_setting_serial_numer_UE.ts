/**
 * @NAPIVersion 2.0
 * @NScriptType UserEventScript
 */



import {EntryPoints} from "N/types";
import * as msr from '../models/jtc_setting_serial_number_ue_MSR';
import * as log from 'N/log';
import * as record from 'N/record';
import * as email from 'N/email';
import * as url from 'N/url';
import * as runtime from 'N/runtime';
import * as cts from '../module/jtc_setting_serial_number_cts';

export const beforeSubmit: EntryPoints.UserEvent.beforeSubmit = (ctx: EntryPoints.UserEvent.beforeSubmitContext) => {
    try{
        if (ctx.type == ctx.UserEventType.EDIT || ctx.type == ctx.UserEventType.CREATE) {
            msr.beforeSubmit(ctx);
        }
    } catch (e) {
        log.error("beforeSubmit", e);
        const currRecord = ctx.newRecord;
        

        
        currRecord.setValue({fieldId: cts.constant.INT_SERIAL_NUMBER.ERRO_MSG, value: e.message});

        // const idRecorSerialNumber = recordInteSerialNumber.save();
        // log.audit("idRecorSeiral number", idRecorSerialNumber);


    }
}


export const afterSubmit: EntryPoints.UserEvent.afterSubmit = (ctx: EntryPoints.UserEvent.afterSubmitContext) => {
    try {
        const currRecord = ctx.newRecord;
        const idSaleOrder = String(currRecord.getValue(cts.constant.INT_SERIAL_NUMBER.SALES_ORDER));
        const errorField = currRecord.getValue(cts.constant.INT_SERIAL_NUMBER.ERRO_MSG)

        const recSalesOrder = record.load({type: record.Type.SALES_ORDER, id: idSaleOrder})
        const tranId = recSalesOrder.getValue(cts.constant.SALES_ORDER.TRANID)

        log.debug('error fields', errorField)
        if (!!errorField) {
            const urlSaleOrder = url.resolveRecord({
                recordType: record.Type.SALES_ORDER,
                recordId: idSaleOrder,
                isEditMode: false
            });
            
            const urlIntSerialNumber = url.resolveRecord({
                recordType: cts.constant.INT_SERIAL_NUMBER.ID,
                recordId: currRecord.id,
                isEditMode: false
            });
    
            const baseUrl = "https://7414781.app.netsuite.com";
            const currScript = runtime.getCurrentScript();
            const employeeId = Number(currScript.getParameter({name: cts.constant.SCRIPT_PARAMS.AUTHOR_EMAIL}));
            const body = `Configurar o estoque do item: </br>
                          </br>
                          Para pedido de venda:<br> </br>
                          <a href="${baseUrl+urlSaleOrder}">Pedido de venda #${tranId}</a><br></br>
                          Registro Serial Number: <br></br>
                          <a href="${baseUrl + urlIntSerialNumber}">RT Serial Number</a>
            `;
            email.send({
                author: employeeId,
                body:body,
                subject: 'Pedido de Venda - Configurar Estoque',
                recipients: ['edison@jtcd.com.br', 'william@jtcd.com.br', 'rogerio.rodrigues@dkcloud.com.br']
            });
        }

        
    } catch (error) {
        log.error('tipo de erro', error)  
    }
}