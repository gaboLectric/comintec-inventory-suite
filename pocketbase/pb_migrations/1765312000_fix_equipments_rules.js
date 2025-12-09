/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("equipments")

  // Update rules to allow authenticated users to list/view
  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = "@request.auth.id != \"\""
  
  // Ensure mutation rules are restricted
  collection.createRule = "@request.auth.user_level <= 2"
  collection.updateRule = "@request.auth.user_level <= 2"
  collection.deleteRule = "@request.auth.user_level <= 2"

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("equipments")

  // Revert to null (admin only) as per previous migration state
  collection.listRule = null
  collection.viewRule = null

  return app.save(collection)
})
