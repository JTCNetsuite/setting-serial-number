/**
 * @NApiVersion 2.x
 * @NModuleScope public
 */


export const constant = {
    SALES_ORDER: {
        SUBLIST_ITEM: {
            ID: 'item',
            ITEM: 'item',
            ITEM_DISPLAY: 'item_display'

        },
        SUBLIST_INVENTORY_DETAIL: {
            ID: 'inventoryassignment',
            NUM_SERIAL: 'issueinventorynumber',
            QUATITY: 'quantity'
        },
        SUBRECORD_INVETORY_DETAITL: {
            ID: 'inventorydetail'
        },
        LOTE_PROCESSADO: 'custbody_jtc_integ_lote_preenchido',
        TRANID: 'tranid'
    },

    INT_SERIAL_NUMBER: {
        ID: 'customrecord_jtc_integ_serialnumber',
        SALES_ORDER: 'custrecord_jtc_integ_salesorder_id',
        NUM_SERIAL: 'custrecord_jtc_inte_serial_number',
        ITEM: 'custrecord_jtc_integr_data_salesorder',
        ERRO_MSG: 'custrecord_jtc_integ_serialerror'
    },
    INVENTORY_NUMBER: {
        NUM_SERIAL: 'inventorynumber'
    },
    SCRIPT_PARAMS: {
        AUTHOR_EMAIL: 'custscript_jtc_author_email'
    }
}