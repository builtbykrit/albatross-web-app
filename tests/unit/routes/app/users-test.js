import { moduleFor, test } from 'ember-qunit';

moduleFor('route:app/users', 'Unit | Route | app/users', {
  // Specify the other units that are required for this test.
   needs: ['service:current-user']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
