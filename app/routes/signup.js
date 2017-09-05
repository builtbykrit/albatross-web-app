import Errors from '../constants/errors'
import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin,{

  routeIfAlreadyAuthenticated: ENV.routeAfterAuthentication,

  actions: {
    signup(user, teamName, inviteCode, result) {
      const json = user.serialize();
      if (inviteCode) {
        json.data.attributes.code = inviteCode;
      }
      Ember.$.ajax({
        url: ENV.host + '/api/v1/registration/',
        type: 'POST',
        data: JSON.stringify(json),
        headers: {
          'Accept': 'application/vnd.api+json'
        },
        contentType: 'application/vnd.api+json',
        dataType: 'json',
      }).then(() => {
          this.get('session')
            .authenticate('authenticator:django-rest-authenticator', user.get('email'), user.get('password'))
            .then(() => {
            if (inviteCode) {
              this.transitionTo('app.projects');
            } else {
              const team = this.get('store').createRecord('team', {
                name: teamName
              });
              team.save()
                .then(() => {
                  this.transitionTo('app.projects');
                }).catch((response) => {
                this.get('session').invalidate();
                this.controller.set('errors', Errors.mapResponseErrors(response));
                result.reject();
              })
            }
            })
            .catch((response) => {
              this.controller.set('errors', Errors.mapResponseErrors(response));
              result.reject();
            });
      }).catch((response) => {
        this.controller.set('errors', Errors.mapResponseErrors(response));
        result.reject();
      });
    }
  }
});
