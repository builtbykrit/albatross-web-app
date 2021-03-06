import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
const { inject: {service}, testing } = Ember;

export default Ember.Route.extend(ApplicationRouteMixin,{

  currentUser: service('current-user'),
  routeAfterAuthentication: ENV.routeAfterAuthentication,
  segment: Ember.inject.service(),

  beforeModel(transition) {
    this._super(transition);
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },

  identifyUser() {

    if (this.get('currentUser.user')) {
      const user = JSON.parse(JSON.stringify(this.get('currentUser.user')));

      if (user) {
        this.get('segment').identifyUser(this.get('currentUser.user.id'), user);
      }
    }
  },

  sessionInvalidated() {
    if (!testing) {
      window.location.replace('/login');
    }
  },

  _loadCurrentUser() {
    if (!this.get('currentUser')) {
     return;
    }
    return this.get('currentUser').load().catch(() => {
        if (this.get('session.isAuthenticated')) {
          this.get('session').invalidate()
        }
      }
    );
  }
});
