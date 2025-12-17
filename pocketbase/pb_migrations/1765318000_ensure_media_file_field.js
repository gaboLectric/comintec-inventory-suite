/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const media = app.findCollectionByNameOrId("media");
    
    if (!media) {
        console.log("⚠️ media collection not found");
        return;
    }

    // Check if file field exists
    try {
        const existingField = media.fields.getByName("file");
        if (existingField) {
            console.log("ℹ️ file field already exists in media");
            return;
        }
    } catch (e) {
        // Field doesn't exist, add it
    }

    // Add file field
    media.fields.add(new Field({
        name: "file",
        type: "file",
        required: false,
        maxSelect: 1,
        maxSize: 5242880,
        mimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    }));

    app.save(media);
    console.log("✅ Added file field to media collection");
}, (app) => {
    // Rollback: remove file field
    const media = app.findCollectionByNameOrId("media");
    if (media) {
        try {
            media.fields.removeByName("file");
            app.save(media);
            console.log("✅ Removed file field from media");
        } catch (e) {
            console.log("⚠️ Could not remove file field:", e);
        }
    }
});
