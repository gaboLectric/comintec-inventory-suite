/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const media = app.findCollectionByNameOrId("media");
    
    if (media) {
        // Allow superusers and users with level <= 2 to create/update/delete media
        media.createRule = "@request.auth.id != '' && (@request.auth.collectionName = '_superusers' || @request.auth.user_level <= 2)";
        media.updateRule = "@request.auth.id != '' && (@request.auth.collectionName = '_superusers' || @request.auth.user_level <= 2)";
        media.deleteRule = "@request.auth.id != '' && (@request.auth.collectionName = '_superusers' || @request.auth.user_level <= 2)";
        
        app.save(media);
        console.log("✅ Fixed media collection rules for superusers");
    }
}, (app) => {
    const media = app.findCollectionByNameOrId("media");
    
    if (media) {
        // Revert to original rules
        media.createRule = "@request.auth.user_level <= 2";
        media.updateRule = "@request.auth.user_level <= 2";
        media.deleteRule = "@request.auth.user_level <= 2";
        
        app.save(media);
    }
});
