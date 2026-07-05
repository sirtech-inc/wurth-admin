import {OptionalAll} from "@shared/types/util.types";
import {Carrier, CarrierValuesPost} from "@shared/interface/carrier.interface";
import {Params} from "@shared/interface";


export class GetCarriers {
    static readonly type = "[Carrier] Get";

    constructor(
        public payload?: Params
    ) {
    }
}

export class CreateUpdateCarrier {
    static readonly type = "[Carrier] CreateUpdate";

    constructor(public payload: OptionalAll<CarrierValuesPost>) {
    }
}

export class EditCarrier {
    static readonly type = "[Carrier] Edit";

    constructor(public payload: number) {
    }
}

export class CarrierLoader {
    static readonly type = "[Carrier] Loader";

    constructor(public payload: boolean) {
    }
}

export class CarrierDepartments {
    static readonly type = "[Carrier] Departments";

    constructor() {
    }
}

export class CarrierSaveOk {
    static readonly type = "[Carrier] Save";

    constructor(public payload: boolean) {
    }
}