/* @flow */

import invariant from '../invariant';
import Store from './Store';
import StoreFactory from './StoreFactory';

const HINT_LINK =
  'Learn more about defining stores:' +
  ' https://github.com/HubSpot/general-store#create-a-store';

function dropFirstArg(func) {
  return function(head, ...tail) {
    func(...tail);
  };
}

export default class StoreSingleton {

  _facade: ?Store;
  _factory: StoreFactory;
  _getter: ?Function;

  constructor() {
    this._facade = null;
    this._factory = new StoreFactory({
      getter: (state, ...args) => {
        if (typeof this._getter === 'function') {
          return this._getter(...args);
        }
      },
    });
    this._getter = null;
  }

  defineGet(
    getter: () => any
  ): StoreSingleton {
    invariant(
      !this.isRegistered(),
      'StoreSingleton.defineGet: this store definition cannot be modified' +
      ' because is has already been registered with a dispatcher. %s',
      HINT_LINK
    );
    invariant(
      typeof getter === 'function',
      'StoreSingleton.defineGet: expected getter to be a function but got' +
      ' "%s" instead. %s',
      getter,
      HINT_LINK
    );
    this._getter = getter;
    return this;
  }

  defineResponseTo(
    actionTypes: Array<string> | string,
    response: (data: any) => void
  ): StoreSingleton {
    invariant(
      !this.isRegistered(),
      'StoreSingleton.defineResponseTo: this store definition cannot be' +
      ' modified because is has already been registered with a dispatcher. %s',
      HINT_LINK
    );
    this._factory = this._factory.defineResponseTo(
      actionTypes,
      dropFirstArg(response)
    );
    return this;
  }

  isRegistered(): bool {
    return this._facade instanceof Store;
  }

  register(dispatcher: ?Dispatcher): Store {
    invariant(
      typeof this._getter === 'function',
      'StoreSingleton.register: a store cannot be registered without a' +
      ' getter. Use GeneralStore.define().defineGet(getter) to define a' +
      ' getter. %s',
      HINT_LINK
    );
    if (!this._facade) {
      this._facade = this._factory.register(dispatcher);
    }
    return this._facade;
  }
}
