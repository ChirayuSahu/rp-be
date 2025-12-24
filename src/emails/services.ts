import { stat } from "node:fs";
import { sql, poolPromise } from "../config/db";

export async function orderStatus(invoiceType: string, invoiceNo: string){
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('invoiceType', sql.VarChar, invoiceType)
            .input('invoiceNo', sql.VarChar, invoiceNo)
            .query(`SELECT 
	sp1.Vtyp, sp1.Vno,
	sp1.SyncTag,
	acm.Name
FROM BillTrackSP1 sp1
INNER JOIN BillTrackAcm acm
  ON sp1.Acno = acm.Code
WHERE sp1.Vtyp = @invoiceType
  AND sp1.Vno = @invoiceNo;
`);

        const finalRes = result.recordset;
        let status = 'Invalid';

        if(result.recordset.length > 0){
            if(result.recordset[0].SyncTag === '6'){
                status = 'Dispatched';
            } else if(result.recordset[0].SyncTag === '5'){
                status = 'Ready for Dispatch';
            } else if(result.recordset[0].SyncTag === '3' || result.recordset[0].SyncTag === '4'){
                status = 'Picking Stage';
            } else if(result.recordset[0].SyncTag === '2'){
                status = 'Printed';
            } else {
                status = 'Processing';
            }
            return {status, name: finalRes[0].Name, invType: finalRes[0].Vtyp, invNo: finalRes[0].Vno};
        } else {
            return { status: 'Invalid', name: '', invType: '', invNo: '' };
        }
    } catch (error) {
        console.error("Error fetching order status:", error);
        throw error;
    }
}