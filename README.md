# React-MVC

## Description
A powerful tool for simplifying React state and behavior management.

***Why choose react-mvc?***
Imagine you are developing an application that allows users to switch between multiple skin styles freely. Typically, you might use multiple sets of CSS styles to achieve this. However, what if the different skin styles not only differ in appearance but also in layout and interactions?

You might consider handling the different styles separately and abstracting common methods into utils for reuse. This is indeed a feasible solution, but the problem arises when you need to retain the data state while switching skins: the functions in utils are stateless.

At this point, you might consider using Redux to manage state and encapsulating common methods into dispatches, which are then called through mapStateToProps. While this can meet our requirements, it comes at the cost of writing a lot of boilerplate code, making the codebase abstract and hard to understand.

***The react-mvc Solution***
This is precisely why we developed react-mvc. By separating logic from UI, react-mvc allows state and methods to be centrally managed, while the UI can still be freely implemented. No matter how complex the interface is, you can easily share state and methods within the scope.
react-mvc provides a simple yet powerful way to manage state and common behaviors in complex applications. It not only reduces boilerplate code but also improves code readability and maintainability.
With react-mvc, you can focus on building exceptional user interfaces without being bogged down by complex state management and common method calls. Try react-mvc now and experience unprecedented development convenience!

***Key Features:***
- ***Scope:*** Unlike Redux's single global store, you can create multiple react-mvc instances and nest them. Different instances are distinguished by keys, and the granularity is up to you.
- ***Separation of Logic and UI:*** Makes state and method management more streamlined and organized.
- ***Simple and Efficient State Management:*** When state changes, it does not update the entire component tree, only the components that use the changed state.
- ***Lifecycle Hooks:*** Provides lifecycle hook methods.
- ***Ease of Use:*** No need for extensive boilerplate code; only a few APIs are required to get started easily.

## Usage
```bash
npm i @jser-tang/react-mvc
```

## API
- ***AppController(key: string; ctrl: IExtendsCtrl)***
> Create a controller instance where you can manage your store, declaration cycle, and methods

- ***withCtrl(conponent: React.FunctionComponent; )***
> Wrap components so that they have the ability to share data and call common methods

## Example
***controller.js***
```jsx
import { createController } from '@jser-tang/react-mvc';

const { Controller, withCtrl } = createController<IHomeProps>('appHome', {
    async init() {
        // The init method is called when the instance is created, where some initialization operations can be done, such as requesting and updating data
        const initBData = await fetch('xxxxx');
        // data.a.b -> ['a', 'b']
        this.setData(initBData, ['a', 'b']),
    },
    methods: {
        // You define your own public methods in the controller, inside which you can get the store data
        addCount() {
            const count = this.data.count;
            this.setData(count + 1, ['count']);
        },
    }
});

export { AppController: Controller, withCtrl };
```

***app.jsx***
```jsx
import { ChildComponent } from './childComponent';
import { AppController } from './controller';

const App = () => {
    const initData = {
        count: 0,
        a: {
            b: void 0,
        }
    };
    return (
        <AppController store={props}>
            <ChildComponent />
        </AppController>
    );
};
```

***childComponent.jsx***
```jsx
import { withCtrl } from './controller';

export const OnliveTipWrap = withCtrl((props) => {
    const { $ctrl: {data, addCount} } = props;
    return (
        <div>
            <p>
                {data.count}
            </p>
            <button onClick={addCount}> addCount </button>
        </div>
    );
});
```

## License
MIT licensed.