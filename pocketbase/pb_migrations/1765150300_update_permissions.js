/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collections = ["products", "sales", "categories", "media"];
    
    for (const name of collections) {
        const collection = app.findCollectionByNameOrId(name);
        collection.listRule = "";
        collection.viewRule = "";
        collection.createRule = "@request.auth.id != ''";
        collection.updateRule = "@request.auth.id != ''";
        collection.deleteRule = "@request.auth.id != ''";
        app.save(collection);
    }
}, (app) => {
    // Revert to null (admin only)
    const collections = ["products", "sales", "categories", "media"];
    for (const name of collections) {
        const collection = app.findCollectionByNameOrId(name);
        collection.listRule = null;
        collection.viewRule = null;
        app.save(collection);
    }
})
