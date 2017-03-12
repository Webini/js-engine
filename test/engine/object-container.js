/*global describe,it*/
'use strict';

const ObjectContainer = require('../../src/engine/object-container.js');
const assert          = require('assert');

describe('ObjectContainer', () => {
  class Test {
    getName() { return 'Test'; }
  }

  class TestDependency {
    $getDependencies() { 
      return {
        myCustomDepName: 'Test'
      };
    }

    getName() { return 'TestDependency'; }
  }

  class TestSetter {
    $getDependencies() {
      return {
        myCustomDep: 'TestDependency'
      };
    }

    setMyCustomDep(dep) {
      this.dep = dep;
    }
  }

  class Unregistered {
    $getDependencies() {
      return {
        myCustomDep: 'Test'
      };
    }
  }

  it('should instanciate an object without dependencies', () => {
    const container = new ObjectContainer();
    container.register('Test', Test);
    assert.strictEqual(container.get('Test').getName(), 'Test');
  });

  it('should failed at consistancy test', () => {
    const container = new ObjectContainer();
    container.register('TestDependency');
    
    assert.throws(() => {
      container.assertConsistency();
    });
  });

  it('should populate dependencies without setter', () => {
    const container = new ObjectContainer();
    container
      .register('TestDependency', TestDependency)
      .register('Test', Test)
    ;

    assert.strictEqual(container.get('TestDependency').getName(), 'TestDependency');
    assert.strictEqual(container.get('TestDependency').myCustomDepName, container.get('Test'));
  });

  it('should populate dependencies using custom setter', () => {
    const container = new ObjectContainer();
    container
      .register('TestSetter', TestSetter)
      .register('TestDependency', TestDependency)
      .register('Test', Test)
    ;

    assert.strictEqual(container.get('TestSetter').dep, container.get('TestDependency'));
  });

  it('should inject dependencies into an unregistered item', () => {
    const container = new ObjectContainer();
    container.register('Test', Test);
    const unreg = new Unregistered();
    container.injectTo(unreg);

    assert.strictEqual(unreg.myCustomDep, container.get('Test'));
  });
});