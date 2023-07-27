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

export const afterSubmit: EntryPoints.UserEvent.afterSubmit = (ctx: EntryPoints.UserEvent.afterSubmitContext) => {
    try{
        msr.afterSubmit(ctx);
    } catch (e) {
        log.error("afterSubmit", e);
        const currRecord = ctx.newRecord;
        const idSaleOrder = String(currRecord.getValue(cts.constant.INT_SERIAL_NUMBER.SALES_ORDER));
        const item = currRecord.getText(cts.constant.INT_SERIAL_NUMBER.ITEM);
        const salesOrderText = currRecord.getText(cts.constant.INT_SERIAL_NUMBER.SALES_ORDER);
        
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
                      ${item} <br></br>
                      </br>
                      Para pedido de venda:<br> </br>
                      <a href="${baseUrl+urlSaleOrder}">${salesOrderText}</a><br></br>
                      Registro Serial Number: <br></br>
                      <a href="${baseUrl + urlIntSerialNumber}">RT Serial Number</a>
        `;
        email.send({
            author: employeeId,
            body:body,
            subject: 'Pedido de Venda - Configurar Estoque',
            recipients: ['edison@jtcd.com.br']
        });

        const recordInteSerialNumber = record.load({
            type: cts.constant.INT_SERIAL_NUMBER.ID,
            id: currRecord.id
        });
        recordInteSerialNumber.setValue({fieldId: cts.constant.INT_SERIAL_NUMBER.ERRO_MSG, value: e.message});

        recordInteSerialNumber.save();


    }
    
}


