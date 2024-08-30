/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("24j7x9ot48riaoh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ebty37ly",
    "name": "scriveStatus",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("24j7x9ot48riaoh")

  // remove
  collection.schema.removeField("ebty37ly")

  return dao.saveCollection(collection)
})
