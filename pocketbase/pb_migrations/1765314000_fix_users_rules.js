/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");

  // Allow all authenticated users to list/view other users
  // This is necessary for the Users page to work for non-admins if they need to see the list
  collection.listRule = "@request.auth.id != \"\"";
  collection.viewRule = "@request.auth.id != \"\"";

  // Keep mutations restricted to Admins (level 1) or maybe Special (level 2) depending on requirements
  // Assuming only Admin (1) should manage users
  collection.createRule = "@request.auth.user_level = 1";
  collection.updateRule = "@request.auth.user_level = 1 || @request.auth.id = id"; // Admin or self
  collection.deleteRule = "@request.auth.user_level = 1";

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");

  // Revert to default (usually restricted)
  collection.listRule = "id = @request.auth.id";
  collection.viewRule = "id = @request.auth.id";

  return app.save(collection);
})
