import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel() {
    this._super(...arguments);
    window.scrollTo(0,0);
  }
});