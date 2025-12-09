/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("equipments");
    
    if (!collection) {
        console.log("equipments collection not found");
        return;
    }

    // Add fields to equipments using Field constructor
    collection.fields.add(new Field({ name: "codigo", type: "text", required: false }));
    collection.fields.add(new Field({ name: "producto", type: "text", required: true }));
    collection.fields.add(new Field({ name: "marca", type: "text", required: false }));
    collection.fields.add(new Field({ name: "modelo", type: "text", required: false }));
    collection.fields.add(new Field({ name: "numero_serie", type: "text", required: true, options: { min: 1 } }));
    collection.fields.add(new Field({ name: "pedimento", type: "text", required: false }));
    collection.fields.add(new Field({ name: "observaciones", type: "text", required: false, options: { max: 100 } }));

    // Update rules
    collection.listRule = "@request.auth.id != \"\"";
    collection.viewRule = "@request.auth.id != \"\"";

    return app.save(collection);
}, (app) => {
    // Rollback: remove added fields
    const collection = app.findCollectionByNameOrId("equipments");
    if (collection) {
        collection.fields.removeByName("codigo");
        collection.fields.removeByName("producto");
        collection.fields.removeByName("marca");
        collection.fields.removeByName("modelo");
        collection.fields.removeByName("numero_serie");
        collection.fields.removeByName("pedimento");
        collection.fields.removeByName("observaciones");
        app.save(collection);
    }
});
