/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("equipments")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool_vendido",
    "name": "vendido",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("equipments")

  // remove field
  collection.fields.removeByName("vendido")

  return app.save(collection)
})
