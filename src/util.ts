export type UnknownObj = Record<string, any>;

export const isObject = (obj: any) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

export type UnknownType = string | number | object;

export function isEmptyObject(obj?: UnknownObj): boolean {
    if (typeof obj !== 'object') {
        return true;
    }
    for (const name in obj) {
        if (name) {
            return false;
        }
    }
    return true;
}

export const isSameObj = (obj1: UnknownObj, obj2: UnknownObj) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const isSame = (v1?: UnknownType, v2?: UnknownType): boolean => {
    if (v1 === v2) {
        return true;
    }

    if (!v1 || !v2) {
        return v1 === v2;
    }

    if (typeof v1 !== typeof v2) {
        return false;
    }

    if (Object.prototype.toString.call(v1) !== Object.prototype.toString.call(v2)) {
        return false;
    }

    if (isObject(v1) && isObject(v2)) {
        return isSameObj(v1 as UnknownObj, v2 as UnknownObj);
    }

    if (Array.isArray(v1) && Array.isArray(v2)) {
        if (v1.length !== v2.length) {
            return false;
        }
        return v1.every((item, i) => isSame(item, v2[i]));
    }
    return String(v1) === String(v2);
};

export const setValue = (obj: any, keys: string[], value: any) => {
    keys.reduce((cur: any, key: string, index) => {
        if (!cur[key]) {
            cur[key] = {};
        }
        if (index === keys.length - 1) {
            cur[key] = value;
        }
        return cur[key];
    }, obj);
    return obj;
};

export const getValue = (obj: any, keys: string[]) => {
    let val = null;
    keys.reduce((cur: any, key: string, index) => {
        if (!cur[key]) {
            cur[key] = {};
        }
        if (index === keys.length - 1) {
            val = cur[key];
        }
        return cur[key];
    }, obj);
    return val;
};
