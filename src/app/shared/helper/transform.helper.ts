import { TypeStatus } from "@shared/types/util.types";

export class Transform {

    static CheckIsActive(value: TypeStatus) : boolean {
        return value === 'active' || value === 1 || value === true
    }

    static ArrayHasValue(array: any) : boolean {
        return Array.isArray(array)  && array.length > 0
    }


}