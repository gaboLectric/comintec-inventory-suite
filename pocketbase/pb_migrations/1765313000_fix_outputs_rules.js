/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collections = ["equipment_outputs", "supply_outputs"];

  collections.forEach((name) => {
    const collection = app.findCollectionByNameOrId(name);

    // Allow all authenticated users to list/view outputs
    collection.listRule = "@request.auth.id != \"\"";
    collection.viewRule = "@request.auth.id != \"\"";

    // Keep mutations restricted
    collection.createRule = "@request.auth.user_level <= 2";
    collection.updateRule = "@request.auth.user_level <= 2";
    collection.deleteRule = "@request.auth.user_level <= 2";

    app.save(collection);
  });
}, (app) => {
  const collections = ["equipment_outputs", "supply_outputs"];

  collections.forEach((name) => {
    const collection = app.findCollectionByNameOrId(name);

    // Revert to restricted access
    collection.listRule = "@request.auth.user_level <= 2";
    collection.viewRule = "@request.auth.user_level <= 2";

    app.save(collection);
  });
})
