import { Component } from 'react';

export interface IWithCtrlProps<T> {
    $ctrl: {
        data: T;
        getData: (paths?: string[]) => any;
        setData: (data: any, paths?: string[], cb?: (state: T) => void) => void;
        [name: string]: any;
    };
}

export abstract class AbstractCtrl<T, S> extends Component<T, S> {
    public get data() {
        return this.state;
    }
    public abstract getData: (paths?: string[]) => any;
    public abstract setData: (data: any, paths?: string[], cb?: (state: unknown) => void) => void;
    [key: string]: any;
}

export interface IExtendsCtrl {
    [name: string]: any;
    methods?: {
        [name: string]: any;
    };
    init?(): void;
}
