/**
 * @NApiVersion 2.x
 * @NModuleScope public
 */


import { EntryPoints } from 'N/types';
import * as search from  'N/search';
import * as record from  'N/record';
import * as log from 'N/log';
import * as cts from "../module/jtc_setting_serial_number_cts";



export const afterSubmit = (ctx: EntryPoints.UserEvent.afterSubmitContext) => {
    const currRecord = ctx.newRecord;
    const idSaleOrder = currRecord.getValue(cts.constant.INT_SERIAL_NUMBER.SALES_ORDER);

    const recordSales = record.load({
        type: record.Type.SALES_ORDER,
        id: idSaleOrder,
        isDynamic: true
    });
    
    const getLinecount = recordSales.getLineCount({sublistId: cts.constant.SALES_ORDER.SUBLIST_ITEM.ID});

    
    var numLoteSerie = String(currRecord.getValue(cts.constant.INT_SERIAL_NUMBER.NUM_SERIAL));
    var numLoteArr = tranformToArrayNumserial(numLoteSerie);

    let checkLote = false;

    const itemIntegracao = currRecord.getValue(cts.constant.INT_SERIAL_NUMBER.ITEM);

    for(var i=0; i < getLinecount; i++){
        recordSales.selectLine({
            sublistId: cts.constant.SALES_ORDER.SUBLIST_ITEM.ID,
            line: i
        });

        const inventoryDetail = recordSales.getCurrentSublistSubrecord({
            sublistId: cts.constant.SALES_ORDER.SUBLIST_ITEM.ID,
            fieldId: cts.constant.SALES_ORDER.SUBRECORD_INVETORY_DETAITL.ID
        });

        const idItem = recordSales.getCurrentSublistValue({
            sublistId: cts.constant.SALES_ORDER.SUBLIST_ITEM.ID, 
            fieldId: cts.constant.SALES_ORDER.SUBLIST_ITEM.ITEM
        });

        const itemDisplay = String(recordSales.getCurrentSublistValue({
            sublistId: cts.constant.SALES_ORDER.SUBLIST_ITEM.ID, 
            fieldId:cts.constant.SALES_ORDER.SUBLIST_ITEM.ITEM_DISPLAY
        })).split(" ")[0];

        log.debug("itemi", idItem);
        log.debug("itemdisplar", itemDisplay);

        const lineCountInventoryDetail = inventoryDetail.getLineCount({sublistId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.ID});


        if (lineCountInventoryDetail == 0 && itemIntegracao == idItem) {
            const numLote = searchNumLote(itemDisplay, numLoteArr);

            
            for (var j=0; j < numLote.length; j++) {
                
                log.debug('numberLote', numLote[j]);

                const numberSerilFromSearch = numLote[j].getValue(cts.constant.INVENTORY_NUMBER.NUM_SERIAL);

                const qtde = numLoteArr[numLoteArr.indexOf(numberSerilFromSearch) + 1]

                log.debug("qtde", qtde);
                log.debug("numberSerilFromSearch", numberSerilFromSearch);

                inventoryDetail.selectNewLine({sublistId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.ID});


                log.debug("numLoteSerie", numLoteSerie);
        
                

                inventoryDetail.setCurrentSublistValue({
                    fieldId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.NUM_SERIAL,
                    sublistId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.ID,
                    value: numLote[j].id
                });

                inventoryDetail.setCurrentSublistValue({
                    fieldId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.QUATITY,
                    sublistId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.ID,
                    value: qtde
                });


                inventoryDetail.commitLine({sublistId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.ID});

                checkLote = true;
            }
         

           
        } else {
            if (itemIntegracao == idItem) {
                const numLote = searchNumLote(itemDisplay, numLoteArr);

                for (var j=0; j < numLote.length; j++) {
                    log.debug('numberLote', numLote[j]);
                    

                    const numberSerilFromSearch = numLote[j].getValue(cts.constant.INVENTORY_NUMBER.NUM_SERIAL);
                    const qtde = numLoteArr[numLoteArr.indexOf(numberSerilFromSearch) + 1]
    
                    log.debug("qtde", qtde);
                    log.debug("numberSerilFromSearch", numberSerilFromSearch);
                    inventoryDetail.selectLine({sublistId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.ID, line:j});
    
    
                    log.debug("numLoteSerie", numLoteSerie);
            
                    
    
                    inventoryDetail.setCurrentSublistValue({
                        fieldId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.NUM_SERIAL,
                        sublistId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.ID,
                        value: numLote[j].id
                    });
    
                    inventoryDetail.setCurrentSublistValue({
                        fieldId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.QUATITY,
                        sublistId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.ID,
                        value: qtde
                    });
    
    
                    inventoryDetail.commitLine({sublistId: cts.constant.SALES_ORDER.SUBLIST_INVENTORY_DETAIL.ID});

                    checkLote = true;
                }
                
            }
            
        }


        recordSales.commitLine({sublistId:cts.constant.SALES_ORDER.SUBLIST_ITEM.ID});
    }
    if(checkLote) {
        recordSales.setValue({fieldId: cts.constant.SALES_ORDER.LOTE_PROCESSADO, value: true});   
    }

    const retIdSales = recordSales.save({ignoreMandatoryFields: true});
    log.debug("retIdSales", retIdSales);
}



const searchNumLote = (itemid, numLote) => {
    const filterArr = [
            ["item.name", search.Operator.IS, itemid], 
            "AND"
        ];
    
    const inventoryArr = [];

    for (var i=0; i < numLote.length; i+= 2) {
        inventoryArr.push([cts.constant.INVENTORY_NUMBER.NUM_SERIAL, search.Operator.IS, numLote[i]], "OR");
    }
    inventoryArr.pop();
    filterArr.push(inventoryArr);

    const seaNumSerieLote = search.create({
        type: search.Type.INVENTORY_NUMBER,
        filters: filterArr,
        columns: [
            search.createColumn({name: cts.constant.INVENTORY_NUMBER.NUM_SERIAL})
        ]
    }).run().getRange({start: 0, end:100});

    if (seaNumSerieLote.length > 0) {
        return seaNumSerieLote;
    } else {
        throw "Numero de lote não encontrado!";
    }    
    
}

const tranformToArrayNumserial = (numLoteSerie: String) => {
    var ajudaSerier;
    var numLoteArr = [];

    if (numLoteSerie.indexOf(",") == -1) {
        numLoteArr = numLoteSerie.split("(");
        numLoteArr[1] = numLoteArr[1].slice(0,-1);

    } else {
        ajudaSerier = numLoteSerie.split(",");
        for (var i=0; i < ajudaSerier.length; i++) {
            
            ajudaSerier[i] = ajudaSerier[i].split("(");
            ajudaSerier[i][1] = ajudaSerier[i][1].slice(0,-1);

            for (var j =0; j < ajudaSerier[i].length; j++){
                numLoteArr.push(ajudaSerier[i][j])
            }
        }

    }

    return numLoteArr;
}