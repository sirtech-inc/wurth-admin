export class ConvertClassHelper {
    static toNumber(data: any, extra = null) {
        return data ? Number(data.toString()) : extra;
    }
}