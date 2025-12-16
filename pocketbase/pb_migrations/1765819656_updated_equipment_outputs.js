/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3888281762")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1367337470",
    "max": 0,
    "min": 0,
    "name": "equipment_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text540224921",
    "max": 0,
    "min": 0,
    "name": "codigo",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2814051861",
    "max": 0,
    "min": 0,
    "name": "producto",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text118096147",
    "max": 0,
    "min": 0,
    "name": "marca",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4040649798",
    "max": 0,
    "min": 0,
    "name": "modelo",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text90552329",
    "max": 0,
    "min": 0,
    "name": "numero_serie",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3369090573",
    "max": 0,
    "min": 0,
    "name": "nota",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3888281762")

  // remove field
  collection.fields.removeById("text1367337470")

  // remove field
  collection.fields.removeById("text540224921")

  // remove field
  collection.fields.removeById("text2814051861")

  // remove field
  collection.fields.removeById("text118096147")

  // remove field
  collection.fields.removeById("text4040649798")

  // remove field
  collection.fields.removeById("text90552329")

  // remove field
  collection.fields.removeById("text3369090573")

  return app.save(collection)
})
