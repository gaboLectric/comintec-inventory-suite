/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // 1. Create media collection
    const media = new Collection({
        name: "media",
        type: "base",
        system: false,
        schema: [
            { name: "file", type: "file", options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp"] } }
        ],
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.user_level <= 2",
        updateRule: "@request.auth.user_level <= 2",
        deleteRule: "@request.auth.user_level <= 2",
    });
    app.save(media);

    // 2. Create equipments collection
    const equipments = new Collection({
        name: "equipments",
        type: "base",
        system: false,
        schema: [
            { name: "codigo", type: "text", required: false },
            { name: "producto", type: "text", required: true },
            { name: "marca", type: "text", required: false },
            { name: "modelo", type: "text", required: false },
            { name: "numero_serie", type: "text", required: true, options: { min: 1 } },
            { name: "pedimento", type: "text", required: false },
            { name: "observaciones", type: "text", required: false, options: { max: 100 } },
            { name: "media_id", type: "relation", options: { collectionId: media.id, maxSelect: 1 } }
        ],
        listRule: "@request.auth.id != \"\"", 
        viewRule: "@request.auth.id != \"\"",
        createRule: "@request.auth.user_level <= 2",
        updateRule: "@request.auth.user_level <= 2",
        deleteRule: "@request.auth.user_level <= 2",
    });
    app.save(equipments);
    
    // Add unique index for numero_serie
    try {
        app.db().newQuery("CREATE UNIQUE INDEX idx_unique_numero_serie ON equipments (numero_serie)").execute();
    } catch (e) {
        console.log("Index creation failed (might already exist): " + e);
    }

    // 3. Create supplies collection
    const supplies = new Collection({
        name: "supplies",
        type: "base",
        system: false,
        schema: [
            { name: "nombre", type: "text", required: true },
            { name: "piezas", type: "number", required: true },
            { name: "stock_deseado", type: "number", required: true },
        ],
        listRule: "@request.auth.user_level <= 2",
        viewRule: "@request.auth.user_level <= 2",
        createRule: "@request.auth.user_level <= 2",
        updateRule: "@request.auth.user_level <= 2",
        deleteRule: "@request.auth.user_level <= 2",
    });
    app.save(supplies);

    // 4. Create equipment_outputs collection
    const equipment_outputs = new Collection({
        name: "equipment_outputs",
        type: "base",
        system: false,
        schema: [
            { name: "equipment_id", type: "relation", options: { collectionId: equipments.id, maxSelect: 1 } },
            { name: "codigo", type: "text" },
            { name: "producto", type: "text" },
            { name: "marca", type: "text" },
            { name: "modelo", type: "text" },
            { name: "numero_serie", type: "text" },
            { name: "nota", type: "text" },
            { name: "fecha", type: "date" },
        ],
        listRule: "@request.auth.user_level <= 2",
        viewRule: "@request.auth.user_level <= 2",
        createRule: "@request.auth.user_level <= 2",
        updateRule: "@request.auth.user_level <= 2",
        deleteRule: "@request.auth.user_level <= 2",
    });
    app.save(equipment_outputs);

    // 5. Create supply_outputs collection
    const supply_outputs = new Collection({
        name: "supply_outputs",
        type: "base",
        system: false,
        schema: [
            { name: "supply_id", type: "relation", options: { collectionId: supplies.id, maxSelect: 1 } },
            { name: "nombre", type: "text" },
            { name: "cantidad", type: "number" },
            { name: "nota", type: "text" },
            { name: "fecha", type: "date" },
        ],
        listRule: "@request.auth.user_level <= 2",
        viewRule: "@request.auth.user_level <= 2",
        createRule: "@request.auth.user_level <= 2",
        updateRule: "@request.auth.user_level <= 2",
        deleteRule: "@request.auth.user_level <= 2",
    });
    app.save(supply_outputs);

}, (app) => {
    try { app.delete(app.findCollectionByNameOrId("supply_outputs")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("equipment_outputs")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("supplies")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("equipments")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("media")); } catch(e) {}
})
