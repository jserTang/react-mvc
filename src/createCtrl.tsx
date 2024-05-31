import React, { Component } from 'react';

import { setValue, getValue, isSame, UnknownObj } from './util';
const hoistStatics = require('hoist-non-react-statics');
import { AbstractCtrl, IExtendsCtrl, IWithCtrlProps } from './type';

interface ISingleton {
    C?: React.ComponentClass<{ store: any }, any>;
    W?: <P, _T>(Child: React.FunctionComponent<any>) => React.FunctionComponent<P>;
}

const Singleton: {
    [name: string]: ISingleton;
} = {};

/**
 * 创建 controller
 * @param $key 全局唯一 key
 * @param ctrl controller
 * @returns <Controller store={} />
 */
function createController<T>($key: string | number, ctrl?: IExtendsCtrl) {
    if (Singleton[$key]) {
        console.error('duplicate key are prohibited');
        return { Controller: Singleton[$key].C as React.ComponentClass<{ store: T }, T>, withCtrl: Singleton[$key].W };
    }

    const viewList: Set<React.Component> = new Set();
    class Controller extends AbstractCtrl<{ store: T; children: JSX.Element }, T> {
        public $key = $key;
        public store: T;
        public version = '0';
        public extend: { [name: string]: any } = {};
        constructor(props: { store: T; children: JSX.Element }) {
            super(props);
            this.store = { ...props.store };
            if (ctrl) {
                this.getExtends();
                typeof ctrl.init === 'function' && ctrl.init.call(this);
            }
            Singleton[$key] = Object.assign(Singleton[$key] || {}, { C: this });
        }

        componentWillUnmount() {
            delete Singleton[$key];
        }

        public get data() {
            return this.store;
        }

        public getExtends = () => {
            if (typeof ctrl === 'object') {
                const methods = ctrl.methods;
                for (const key in methods) {
                    const item = methods[key];
                    if (methods.hasOwnProperty(key) && typeof item === 'function') {
                        this.extend[key] = this[key] = item.bind(this);
                    }
                }
            }
        };

        public getData = (paths?: string[]) => {
            if (!paths || !paths.length) {
                return this.data;
            }
            return getValue(this.data, paths);
        };

        public setData = (data: any, paths: string[] = [], cb?: (state: T) => void) => {
            if (isSame(getValue(this.store, paths) as unknown as UnknownObj, data)) {
                return;
            }
            if (!paths || !paths.length) {
                this.store = data;
            } else {
                this.store = setValue(this.store, paths, data);
            }
            viewList.forEach((v) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                v.setState(this.store);
            });
            cb && cb(this.store);
        };

        public render() {
            return this.props.children;
        }
    }

    /**
     * 将 ctrl 中的特性注入组件
     * @param Child 组件
     * @returns 组件
     */
    const withCtrl = <P, T>(Child: React.FunctionComponent<any>): React.FunctionComponent<P> => {
        class C extends Component<any> {
            public ctrl: any;
            constructor(props: any) {
                super(props);
                this.ctrl = Singleton[$key].C;
                if (this.ctrl) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    this.state = this.ctrl.data as T;
                    viewList.add(this);
                }
            }

            public componentWillUnmount() {
                viewList.delete(this);
            }

            public render() {
                const ctrl = this.ctrl;
                if (!ctrl) {
                    return React.createElement(Child, this.props);
                }

                const remainingProps: IWithCtrlProps<T> = {
                    $ctrl: {
                        data: this.state as T,
                        setData: ctrl.setData,
                        getData: ctrl.getData,
                    },
                };
                if (ctrl.extend) {
                    for (const key in ctrl.extend) {
                        if (Object.prototype.hasOwnProperty.call(ctrl.extend, key)) {
                            const element = ctrl.extend[key];
                            remainingProps.$ctrl[key] = element;
                        }
                    }
                }
                const props = Object.assign({}, this.props, remainingProps);
                return <Child {...props} />;
            }
        }

        return hoistStatics(C, Child);
    };

    Singleton[$key] = Object.assign(Singleton[$key] || {}, { W: withCtrl });

    return { Controller, withCtrl };
}

export { createController };
