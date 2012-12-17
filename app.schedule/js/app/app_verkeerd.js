//Tournaments Web App *(Backbone example application)*
/**
 *	Schedule Web App (Backbone example application)
 *	
 *
 */

// Anonymous self-invoked function with jQuery mapped to $
(function ($) {

    // # Schedule data #
    gameData = [
        { date: "Monday, 09:00am", team1:"Chasing", result:"3-1", team2:"Amsterdam Money Gang" },
		{ date: "Monday, 09:00am", team1:"Boomsquad", result:"3-0", team2:"Beast Amsterdam" },
		{ date: "Monday, 10:00am", team1:"Beast Amsterdam", result:"3-1", team2:"Amstedam Money Gang" },
		{ date: "Monday, 10:00am", team1:"Chasing", result:"0-3", team2:"Burning Snow" },
		{ date: "Monday, 11:00am", team1:"Boomsquad", result:"1-3", team2:"Amsterdam Money Gang" },
		{ date: "Monday, 11:00am", team1:"Burning Snow", result:"3-0", team2:"Beast Amsterdam" },
		{ date: "Monday, 12:00pm", team1:"Chasing", result:"1-3", team2:"Beast Amsterdam" },
		{ date: "Monday, 12:00pm", team1:"Boomsquad", result:"3-2", team2:"Burning Snow" },
		{ date: "Monday, 13:00pm", team1:"Chasing", result:"3-2", team2:"Boomsquad" },
		{ date: "Monday, 13:00pm", team1:"Burning Snow", result:"3-1", team2:"Amsterdam Money Gang" }
    ];

	// # Define Game model #
	Game = Backbone.Model.extend({
		// Set model defaults *(backbone method)*
		defaults: {
			"date": "Date unknown",
			"team1":"Team name unknown",
			"result": "Result unknown",
			"team2": "Team name unknown"
		},
		
		// Initialize model *(backbone method)*
		initialize: function () {
			this.logMessage("Game model initialized");
		},
		
		// Log message *(custom method)*
		logMessage: function (message) {
			console.log(message);
		}
	});

	// # Define schedule collection #
	Schedule = Backbone.Collection.extend({
	    // Specifiy model for this collection
		model: Game,
		
		// Initialize collection *(backbone method)*
		initialize: function () {
			this.logMessage("Schedule collection initialized");
		},
		
		// Log message *(custom method)*
		logMessage: function (message) {
			console.log(message);
		}
	});
	
	// # Define Game view #
	GameView = Backbone.View.extend({
	    // Define element (this.el)  
		tagName: "tr",
		
		// Set reference to template
	    template: $("#tournamentTemplate").html(),
		
		// Initialize view *(backbone method)*
		initialize: function () {
			this.logMessage("Game view initialized");
		},
		
		// Render view *(backbone method)*
	    render: function () {
			// Store template in variable
	        var tmpl = _.template(this.template);
			
			// Inject the rendered tempate into the views element 
	        $(this.el).html(tmpl(this.model.toJSON()));
	
			return this;
	    },
	
		// Log message *(custom method)*
		logMessage: function (message) {
			console.log(message);
		}
	});
	
	// # Define Schedule view #
	ScheduleView = Backbone.View.extend({
		// Define element (this.el)     
		el: $("#league"),
		
		// Initialize view *(backbone method)*
	    initialize: function () {
			this.logMessage("League view initialized");
	        
			// Specify collection for this view
			this.collection = new Game(gameData);
			
			// Render view
	        this.render();
			
	    },
		
		// Render view *(backbone method)*
	    render: function () {
	        var self = this;

	        _.each(this.collection.models, function (item) {
	            self.renderSchedule(item);
	        }, this);
	    },
		
		// Render tournament *(custom method)*
	    renderSchedule: function (item) {
			// Create new instance of TournamentView
			var gameView = new GameView({
	            model: item
	        });
	
			// Append the rendered HTML to the views element
	        this.$el.append(gameView.render().el);
	    },
	
		// Log message *(custom method)*
		logMessage: function (message) {
			console.log(message);
		}
		
	});
	
    // Kickstart the application by creating an instance of LeagueView
    var games = new ScheduleView();

} (jQuery));