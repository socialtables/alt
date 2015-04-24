import Alt from '../dist/alt-with-runtime'
import Immutable from 'immutable'
import immutable from '../utils/ImmutableUtil'
import { assert } from 'chai'

export default {
  'Immutable Stores': {
    'immutable stores as a class'() {
      const alt = new Alt()

      const actions = alt.generateActions('fork', 'rm')

      @immutable
      class ImmutableStore {
        constructor() {
          this.bindListeners({
            handleFoo: actions.fork,
            remove: actions.rm
          })

          this.state = Immutable.Map({
            bar: 'hello'
          })
        }

        handleFoo(x) {
          this.setState(this.state.set('foo', x))
        }

        remove() {
          this.setState(this.state.delete('foo'))
        }
      }

      const store = alt.createImmutableStore(ImmutableStore, 'ImmutableStore')

      assert.isUndefined(store.getState().toJS().foo, 'foo has not been defined')

      assert(store.getState().toJS().bar === 'hello', 'bar is part of state')

      actions.fork('lol')

      assert(store.getState().toJS().foo === 'lol', 'foo has been defined')

      const snapshot = JSON.parse(alt.takeSnapshot())

      assert(snapshot.ImmutableStore.foo === 'lol', 'snapshot has proper data')

      alt.bootstrap(JSON.stringify({
        ImmutableStore: { foo: 'bar' }
      }))

      assert(store.getState().toJS().foo === 'bar', 'foo has been set through bootstrap')

      actions.rm()

      assert.isUndefined(store.getState().toJS().foo, 'foo has been removed')
    },
  }
}
