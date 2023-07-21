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
        }
    },

    INT_SERIAL_NUMBER: {
        SALES_ORDER: 'custrecord_jtc_integ_salesorder_id',
        NUM_SERIAL: 'custrecord_jtc_inte_serial_number',
        ITEM: 'custrecord_jtc_integr_data_salesorder'
    },
    INVENTORY_NUMBER: {
        NUM_SERIAL: 'inventorynumber'
    }
}