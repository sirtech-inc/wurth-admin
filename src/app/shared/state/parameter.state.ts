import {Action, Selector, State, StateContext} from "@ngxs/store";
import {AdvanceDropDownFormat, Select2DataFormat, SimpleFormat} from "@shared/interface";
import {Parameter, ParameterFormat, ParameterMain} from "@shared/interface/parameter.interface";

import {GetParameters} from "@shared/action/parameter.action";
import {Injectable} from "@angular/core";
import {ParameterService} from "@shared/services/parameter.service";
import {tap} from "rxjs";

export class ParameterStateModel {
    parameter = {
        datos: [] as ParameterMain[],
    }
}

@State<ParameterStateModel>({
    name: "parameter",
    defaults: {
        parameter: {
            datos: []
        }
    }
})
@Injectable()
export class ParameterState {
    constructor(
        private parameterService: ParameterService
    ) {
    }

    @Selector([ParameterState])
    static parametersSelect2(key: string, showFirstDescription: boolean = true): (state: StateContext<ParameterStateModel>) => Select2DataFormat<SimpleFormat>[] | null {
        return (state: StateContext<ParameterStateModel>): Select2DataFormat<SimpleFormat>[] | null => {
            if (state['parameter']) {
                const data = state['parameter'].parameter.datos.find(p => p.key === key);
                if (Array.isArray(data?.result) && data?.result.length > 0) {
                    return data?.result.map(parameter => ({
                        label: showFirstDescription ? parameter.description_1 : parameter.description_2,
                        value: parameter.value_2,
                        other: {
                            description: parameter.description_2,
                            value: parameter.value_1
                        }
                    }));
                }
            }
            return null
        }
    }

    @Selector([ParameterState])
    static parametersAdvanceDropDown(key: string): (state: StateContext<ParameterStateModel>) => AdvanceDropDownFormat<{
        value: string,
        description: string
    }>[] | null {
        return (state: StateContext<ParameterStateModel>): AdvanceDropDownFormat<{
            value: string,
            description: string
        }>[] | null => {
            if (state['parameter']) {
                const parameterMain = state['parameter'].parameter.datos.find(p => p.key === key);
                if (parameterMain) {
                    return parameterMain.result.map(parameter => ({
                        name: parameter.description_1,
                        code: parameter.value_2,
                        other: {
                            description: parameter.description_2,
                            value: parameter.value_1
                        }
                    }));
                }
            }
            return null
        }
    }

    @Selector([ParameterState])
    static parameters(key: string, mode: 'number' | 'letter' = 'number'): (state: StateContext<ParameterStateModel>) => ParameterFormat[] | null {
        return (state: StateContext<ParameterStateModel>): ParameterFormat[] | null => {
            if (state['parameter']) {
                const parameterMain = state['parameter'].parameter.datos.find(p => p.key === key);
                return parameterMain?.result.map((parameter: Parameter) => ({
                    description: parameter.description_1,
                    value: mode === 'number' ? parameter.value_2 : parameter.value_1
                }))
            }
            return null
        }
    }

    @Action(GetParameters)
    getParameters(ctx: StateContext<ParameterStateModel>, {payload}: GetParameters) {
        return this.parameterService.getParameters(payload.key, payload.addDefaultOption).pipe(
            tap({
                next: result => {
                    const parameterMain: ParameterMain = {
                        key: payload.key,
                        result: result.datos.lista
                    };
                    ctx.patchState({
                        parameter: {
                            datos: [...ctx.getState().parameter.datos, parameterMain]
                        }
                    });
                },
                error: err => {
                    throw new Error(err?.error?.message);
                }
            })
        );
    }

}