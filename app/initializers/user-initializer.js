import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

var User = Ember.Object.extend({
    email: null,
    apiToken: null,
    subscriptionPlan: null,
    subscriptionPrice: null,
    subscriptionRateLimit: 0,
    rateLimit: function () {
        var limit = parseInt(this.get('subscriptionRateLimit'));
        return limit === 0 ? 200 : limit;
    }.property('subscriptionRateLimit'),
    plan: function () {
        var plan = this.get('subscriptionPlan');
        return plan ? plan.capitalize() : 'Basic';
    }.property('subscriptionPlan'),
    isPremium: function () {
        var plan = this.get('plan');
        plan = plan.toLowerCase();
        return plan === 'premium' || plan === 'beta';
    }.property('subscriptionPlan'),
    hasCard: function () {
        var price = parseInt(this.get('subscriptionPrice'), 10);
        return this.get('isPremium') && price > 0;
    }.property('isPremium', 'subscriptionPrice')

});

var UserSession = Ember.Object.extend({

    user: null,

    getUser: function () {

        var user = this.get('user');

        if (user) {
            return new Ember.RSVP.Promise(function (resolve) {
              resolve(user);
            });
        }

        var self = this;
        //var adapter = this.store.adapterFor('application');
        var url = config.APP.API.host + '/api/user';

        return ajax(url, {
            dataType: 'json',
            contentType: 'application/json'
        }).then(function (response) {

            var userData = response.user;

            if (userData._embedded && userData._embedded.subscription) {
                var subscription = userData._embedded.subscription;
                userData.subscriptionPlan = subscription.plan;
                userData.subscriptionPrice = subscription.price;
                userData.subscriptionRateLimit = subscription.rate_limit;
                delete userData._embedded;
            }

            var fields = Object.keys(userData);

            var user = User.create();

            fields.forEach(function (field) {
                user.set(field.camelize(), userData[field]);
            });

            self.set('user', user);

            return user;
        }); 
    }
});

export default {
    name: 'user-session-initializer',
    initialize: function(container, application) {

        //var userSession = UserSession.create();

        application.register('jsonstub:user', UserSession);
        application.inject('controller', 'userSession', 'jsonstub:user');
        application.inject('route', 'userSession', 'jsonstub:user');
    }
};