/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const equipments = app.findCollectionByNameOrId("equipments");
    const media = app.findCollectionByNameOrId("media");
    
    if (!equipments) {
        console.log("⚠️ equipments collection not found");
        return;
    }
    
    if (!media) {
        console.log("⚠️ media collection not found");
        return;
    }

    // Check if media_id field already exists
    try {
        const existingField = equipments.fields.getByName("media_id");
        if (existingField) {
            console.log("ℹ️ media_id field already exists in equipments");
            return;
        }
    } catch (e) {
        // Field doesn't exist, continue
    }

    // Add media_id relation field  
    equipments.fields.add(new Field({
        name: "media_id",
        type: "relation",
        required: false,
        collectionId: media.id,
        maxSelect: 1,
        cascadeDelete: false
    }));

    return app.save(equipments);
}, (app) => {
    // Rollback: remove media_id field
    const equipments = app.findCollectionByNameOrId("equipments");
    if (equipments) {
        try {
            equipments.fields.removeByName("media_id");
            return app.save(equipments);
        } catch (e) {
            console.log("⚠️ Could not remove media_id field:", e);
        }
    }
});
