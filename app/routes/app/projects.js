import Ember from 'ember';
import Errors from '../../constants/errors';
const { inject: { service } } = Ember;

export default Ember.Route.extend({

  model() {
    return this.get('store').findAll('project')
  },

  segment: Ember.inject.service(),

  actions: {

    createProject(name, result) {
      const newProject = this.get('store').createRecord('project',{
        'name':name
      });
        newProject.save()
        .then(() => {
          this.get('segment').trackEvent('Adds a new project');
          this.transitionTo('app.project', newProject.get('id'));
          result.resolve();
        }).catch((response)=> {
          result.reject(Errors.mapResponseErrors(response));
          newProject.rollbackAttributes();
        result.reject();
      })

    },

    goToProject(id) {
      this.transitionTo('app.project', id);
    }
  }
});
