import Ember from 'ember';
import Permissions from '../../constants/permissions';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({

  currentUser: service('current-user'),
  sortedProjects: Ember.computed.sort('model', 'sortDefinition'),
  sortDefinition: ['name'],
  notifications: Ember.inject.service('notification-messages'),
  setupNotifications: function () {
    //console.log(this.get('currentUser'));
    this.get('notifications').setDefaultClearDuration(1000);
  }.observes('notifications').on('init'),
  timeOfDay: Ember.computed(function() {
    const now = new Date();
    const time = moment(now).hour();

    if (time > 17) {
      return "evening";
    } else if (time > 11) {
      return "afternoon"
    } else if (time > 3) {
      return "morning"
    } else {
      return "evening"
    }
  }),
  onTrial: Ember.computed('currentUser', function() {
    return this.get('currentUser.onTrial');
  }),
  init () {

    var onTrial = this.get('currentUser.onTrial');

    if (typeof onTrial !== 'undefined') {
      this.set('onTrial', onTrial);
    }
  },
  canAdd: Ember.computed('sortedProjects', 'currentUser', 'onTrial', function() {
    var limit = this.get('currentUser.maxProjects');
    var projects = this.get('sortedProjects.length');
    var onTrial = this.get('onTrial');

    if (this.get('currentUser.onTrial')) {
      return true;
    } else {
      if (limit === 'unlimited') {
        return true;
      } else {
        return projects < limit;
      }
    }
  }),
  needsToUpgrade: Ember.computed('sortedProjects', 'currentUser', function () {
    var limit = this.get('currentUser.maxProjects');
    var projects = this.get('sortedProjects.length');
    var onTrial = this.get('currentUser.onTrial');

    if (limit === 'unlimited' || onTrial) {
      return false;
    } else {
      return projects > limit;
    }
  }),

  actions: {
      createNewProject(name, result) {
        if (this.get('sortedProjects.length') < 1) {
          this.get('notifications').success("Way to go! You just added your first project. 🏆", {
            cssClasses: 'notification',
            autoClear: true,
            clearDuration: 5000
          });
        }
        this.send('createProject', name, result);
      }
  }
});
