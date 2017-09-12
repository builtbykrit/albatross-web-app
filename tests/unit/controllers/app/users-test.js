import {moduleFor, test} from 'ember-qunit';

moduleFor('controller:app/users', 'Unit | Controller | app/users', {
  // Specify the other units that are required for this test.
  needs: ['validator:presence', 'validator:format', 'service:current-user', 'service:session', 'service:notification-messages-service'],

  beforeEach() {
    const notifications = this.container.lookupFactory('service:notification-messages-service');
    this.register('service:notification-messages', notifications);
  }
});

// Replace this with your real tests.
test('it exists', function (assert) {
  let controller = this.subject();
  assert.ok(controller);
});
