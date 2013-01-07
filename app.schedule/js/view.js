//define individual contact view
    FED2.ContactView = Backbone.View.extend({
        tagName: "tr",
        className: "contact-container",
        template: _.template($("#contactTemplate").html()),

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        
        events: {
            "click button.delete": "deleteContact",
        },
        deleteContact: function () {
            var removedType = this.model.get("team1").toLowerCase();
            this.model.destroy();
            this.remove();
            if (_.indexOf(directory.getTypes(), removedType) === -1) {
                directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
            }
        }
    });

    //define master view
    FED2.DirectoryView = Backbone.View.extend({
        el: $("#contacts"),

        initialize: function () {
            this.collection = new FED2.Directory( FED2.contacts);
                console.dir( this );


            this.render();
            this.$el.find("#filter").append(this.createSelect()); 

            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.renderContact, this);
        },

        render: function () {
            this.$el.find("tr").remove();

            _.each(this.collection.models, function (item) {
                this.renderContact(item);
            }, this);
        },

        renderContact: function (item) {
            var contactView = new FED2.ContactView({
                model: item
            });
            this.$el.append(contactView.render().el);
        },

        getTypes: function () {
            return _.uniq(this.collection.pluck("team1"));
        },

        createSelect: function () {
            var select = $("<select/>", {
                    html: "<option value='all'>First Teams</option>"
                });

            _.each(this.getTypes(), function (item) {
                var option = $("<option/>", {
                    value: item,
                    text: item
                }).appendTo(select);
            });

            return select;
        },

        //add ui events
        events: {
            "change #filter select": "setFilter",
            "click #add": "addContact"
        },

        //Set filter property and fire change event
        setFilter: function (e) {
            this.filterType = e.currentTarget.value;
            this.trigger("change:filterType");
        },

        //filter the view
        filterByType: function () {
            if (this.filterType === "all") {
                this.collection.reset(FED2.contacts);
                FED2.contactsRouter.navigate("filter/all");
            } else {
                this.collection.reset(FED2.contacts, { silent: true });

                var filterType = this.filterType,
                    filtered = _.filter(this.collection.models, function (item) {
                        return item.get("team1") === filterType;
                    });

                this.collection.reset(filtered);

                FED2.contactsRouter.navigate("filter/" + filterType);
            }
        },
        
        //add a new contact
        addContact: function (e) {
            e.preventDefault();

            var formData = {};
            $("#addContact").children("input").each(function (i, el) {
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });

            //update data store
            FED2.contacts.push(formData);

            //re-render select if new type is unknown
            if (_.indexOf(this.getTypes(), formData.type) === -1) {
                this.collection.add(new FED2.Contact(formData));
                this.$el.find("#filter").find("select").remove().end().append(this.createSelect());
            } else {
                this.collection.add(new FED2.Contact(formData));
            }
        },
    });

    //create instance of master view
    FED2.directory = new FED2.DirectoryView();