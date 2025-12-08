/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // Helper to add system fields if missing
    const addSystemFields = (collectionName) => {
        try {
            const collection = app.findCollectionByNameOrId(collectionName);
            
            // Check if 'created' exists, if not add it
            // Note: In JS migration API, we can't easily check field existence without iterating
            // But adding a field with same name might throw or be ignored.
            // However, 'autodate' fields are special.
            
            // We will try to add them. If they exist, this might fail, but since we know they are missing from 'fields' list...
            
            collection.fields.add(new Field({
                name: "created",
                type: "autodate",
                onCreate: true,
                onUpdate: false
            }));
            
            collection.fields.add(new Field({
                name: "updated",
                type: "autodate",
                onCreate: true,
                onUpdate: true
            }));
            
            app.save(collection);
        } catch (e) {
            console.log(`Skipping ${collectionName} system fields update: ${e.message}`);
        }
    };

    addSystemFields("products");
    addSystemFields("sales");
    addSystemFields("categories");
    addSystemFields("media");

}, (app) => {
    // Revert
})
