import { AnyType } from '@interfaces';

interface SetGlobalVariable<T = AnyType> {
    key: string;
    value: T;
}

export class Carrier {
    public globalVariable: Record<string, AnyType> = {};

    set <T>(params: SetGlobalVariable<T>): void {
        this.globalVariable[params.key] = params.value;
    }

    get <U = AnyType>(key: string): U {
        return this.globalVariable[key];
    }
}

export const carrier = new Carrier();
