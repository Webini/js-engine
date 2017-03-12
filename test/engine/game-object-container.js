/*global describe,it*/
'use strict';

const GameObjectContainer = require('../../src/engine/game-object-container.js');
const GameObject          = require('../../src/engine/game-object');
const assert              = require('assert');

describe('GameObjectContainer', () => {
  class GOContainerWithSetter extends GameObjectContainer {
    onGameObjectRemoved(go) {
      go.test = null;
    }

    onGameObjectAdded(go) {
      go.test = this;
    }
  }

  class GameObjectTypeA extends GameObject {}
  class GameObjectTypeB extends GameObject {}
  class GameObjectTypeBBis extends GameObjectTypeB {}

  it('should #attachGameObject', () => {
    const gc = new GOContainerWithSetter();
    const go = new GameObject('myName');
    gc.attachGameObject(go);

    assert.strictEqual(go.test, gc, 'Test should be setted');
    assert.throws(() => {
      gc.attachGameObject(go);
    }, 'It should not be allowed to attach 2 times the same game object to a GameObjectContainer');
  });

  it('should #findGameObject', () => {
    const gc = new GameObjectContainer();
    const go = new GameObject('Test');
    gc.attachGameObject(go);

    const foundByRef = gc.findGameObject(go);
    assert.strictEqual(foundByRef, go, 'GameObject should be found');
    const foundByName = gc.findGameObject(go.name);
    assert.strictEqual(foundByName, go, 'GameObject should be found');
  });

  it('should #detachGameObject', () => {
    const gc = new GOContainerWithSetter();
    const go = new GameObject('Test GO');
    gc.attachGameObject(go);
    gc.detachGameObject(go);

    assert.notStrictEqual(go.test, gc, 'Test should not be setted');
    const searchedGo = gc.findGameObject(go);
    assert.notStrictEqual(searchedGo, go, 'GameObject should not be found');

    gc.attachGameObject(go);
    gc.detachGameObject(go.name);

    assert.notStrictEqual(go.test, gc, 'Test should not be setted');
    const searchedByNameGo = gc.findGameObject(go.name);
    assert.notStrictEqual(searchedByNameGo, go, 'GameObject should not be found');
  });

  it('should #findGameObjectsByType', () => {
    const typeA    = new GameObjectTypeA('typeA');
    const typeB    = new GameObjectTypeB('typeB');
    const typeBBis = new GameObjectTypeBBis('typeBBis');
    const go       = new GameObject('go');
    const gc       = new GameObjectContainer();
    gc
      .attachGameObject(typeA)
      .attachGameObject(typeB)
      .attachGameObject(typeBBis)
      .attachGameObject(go)
    ;

    assert.deepStrictEqual(gc.findGameObjectsByType(GameObjectTypeA), [ typeA ]);
    assert.deepStrictEqual(gc.findGameObjectsByType(GameObjectTypeB), [ typeB, typeBBis ]);
    assert.deepStrictEqual(gc.findGameObjectsByType(GameObjectTypeBBis), [ typeBBis ]);
    assert.deepStrictEqual(gc.findGameObjectsByType(GameObject), [ typeA, typeB, typeBBis, go ]);
  });
});