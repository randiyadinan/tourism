class PaymentStore {
    records = new Map();
    createPayment(data) {
        const record = {
            ...data,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.records.set(data.orderId, record);
        return record;
    }
    getPayment(orderId) {
        return this.records.get(orderId);
    }
    updatePaymentStatus(orderId, update) {
        const record = this.records.get(orderId);
        if (!record)
            return undefined;
        const updated = {
            ...record,
            ...update,
            updatedAt: new Date().toISOString(),
        };
        this.records.set(orderId, updated);
        return updated;
    }
    getAllPayments() {
        return Array.from(this.records.values());
    }
}
export const paymentStore = new PaymentStore();
