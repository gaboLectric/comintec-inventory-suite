/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const users = app.findCollectionByNameOrId("users");
    
    // Add user_level field
    // 1=Admin, 2=Special, 3=User
    users.fields.add(new Field({
        name: "user_level",
        type: "number",
        required: false, // Can be optional initially
        min: 1,
        max: 3
    }));
    
    app.save(users);
}, (app) => {
    const users = app.findCollectionByNameOrId("users");
    try {
        users.fields.removeByName("user_level");
        app.save(users);
    } catch (e) {}
})
