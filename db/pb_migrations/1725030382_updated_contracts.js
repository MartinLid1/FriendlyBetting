/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("24j7x9ot48riaoh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jlnnpoqw",
    "name": "scriveDocumentId",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("24j7x9ot48riaoh")

  // remove
  collection.schema.removeField("jlnnpoqw")

  return dao.saveCollection(collection)
})
