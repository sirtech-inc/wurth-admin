export interface ParametersData {
    lista: Parameter[];
}

export interface ParameterMain {
    key: string
    result: Parameter[]
}

export interface Parameter {
    description_1: string;
    description_2: string;
    value_1: string;
    value_2: number;
}

export interface ParameterFormat{
    description: string;
    value: string;
}