	//add routing
    FED2.ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:team1": "urlFilter"
        },

        urlFilter: function (team1) {
            directory.filterType = team1;
            directory.trigger("change:filterType");
        }
    });

	//create router instance
    FED2.contactsRouter = new FED2.ContactsRouter();

	//start history service
    Backbone.history.start();