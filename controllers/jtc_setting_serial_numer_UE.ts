/**
 * @NAPIVersion 2.0
 * @NScriptType UserEventScript
 */



import {EntryPoints} from "N/types";
import * as msr from '../models/jtc_setting_serial_number_ue_MSR';
import * as log from 'N/log';

export const afterSubmit: EntryPoints.UserEvent.afterSubmit = (ctx: EntryPoints.UserEvent.afterSubmitContext) => {
    try{
        msr.afterSubmit(ctx);
    } catch (e) {
        log.error("afterSubmit", e);
    }
    
}


