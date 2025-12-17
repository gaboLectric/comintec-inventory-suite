/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("equipment_inputs");
    const media = app.findCollectionByNameOrId("media");

    // Helper to add field if missing
    const addField = (field) => {
        try {
            // Check if field exists
            if (collection.fields.getByName(field.name)) {
                console.log(`Field ${field.name} already exists`);
                return;
            }
        } catch (e) {
            // Field doesn't exist, proceed to add
        }
        
        collection.fields.addAt(collection.fields.length, field);
    };

    addField(new Field({ name: "codigo", type: "text" }));
    addField(new Field({ name: "producto", type: "text", required: true }));
    addField(new Field({ name: "marca", type: "text" }));
    addField(new Field({ name: "modelo", type: "text" }));
    addField(new Field({ name: "numero_serie", type: "text", required: true }));
    addField(new Field({ name: "pedimento", type: "text" }));
    addField(new Field({ name: "observaciones", type: "text" }));
    addField(new Field({ name: "vendido", type: "bool" }));
    addField(new Field({ name: "nota", type: "text" }));
    addField(new Field({ name: "fecha", type: "date" }));
    addField(new RelationField({
        name: "media_id",
        type: "relation",
        collectionId: media.id,
        maxSelect: 1
    }));

    app.save(collection);
}, (app) => {
    // Down migration: do nothing or remove fields?
    // Safer to do nothing to avoid data loss
})
