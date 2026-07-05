export class GetParameters{
    static readonly type = "[Parameter] Get";
    constructor(
        public payload : {
            key : string,
            addDefaultOption ?: boolean
        }
    ){}
    // constructor(public payload?: string) {}
}