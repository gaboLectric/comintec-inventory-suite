/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const media = app.findCollectionByNameOrId("media");

    const collection = new Collection({
        name: "equipment_inputs",
        type: "base",
        system: false,
        schema: [
            { name: "codigo", type: "text", required: false },
            { name: "producto", type: "text", required: true },
            { name: "marca", type: "text", required: false },
            { name: "modelo", type: "text", required: false },
            { name: "numero_serie", type: "text", required: true },
            { name: "pedimento", type: "text", required: false },
            { name: "observaciones", type: "text", required: false },
            { name: "vendido", type: "bool", required: false },
            { name: "nota", type: "text", required: false },
            { name: "fecha", type: "date", required: false },
            { name: "media_id", type: "relation", options: { collectionId: media.id, maxSelect: 1 } }
        ],
        listRule: "@request.auth.user_level <= 2",
        viewRule: "@request.auth.user_level <= 2",
        createRule: "@request.auth.user_level <= 2",
        updateRule: "@request.auth.user_level <= 2",
        deleteRule: "@request.auth.user_level <= 2",
    });

    app.save(collection);
}, (app) => {
    try {
        const collection = app.findCollectionByNameOrId("equipment_inputs");
        app.delete(collection);
    } catch (e) {
        console.log("Collection equipment_inputs not found");
    }
})
