import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({

  currentUser: service('current-user'),
  sortedProjects: Ember.computed.sort('model', 'sortDefinition'),
  sortDefinition: ['updatedAt:desc'],

  actions: {
      createNewProject(name, result) {
        this.send('createProject', name, result);
      }
  }
});
