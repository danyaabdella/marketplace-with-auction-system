import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    id: string,
    paymentId: string,
    date: date,
});
const Invoice = mongoose.model.Invoice || mongoose.models('Invoce', invoiceSchema);
export default Invoice;