/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // 1. Update users collection
    const users = app.findCollectionByNameOrId("users");
    
    // Add user_level if not exists
    // Note: In a real migration we might check existence, but here we assume it's fresh or idempotent enough
    // PocketBase migrations fail if field exists, so we wrap in try-catch or check
    // But the JS API doesn't have easy "hasField". 
    // However, since this is a "create schema" migration running once, we define it.
    
    // Actually, users collection is system. We update it.
    users.fields.add(new Field({
        name: "user_level",
        type: "number",
        required: false
    }));
    
    app.save(users);

    // 2. Create categories
    const categories = new Collection({
        name: "categories",
        type: "base",
        listRule: "", // Public
        viewRule: "", // Public
        createRule: "@request.auth.id != ''", // Auth required
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        schema: [
            { name: "name", type: "text", required: true }
        ]
    });
    app.save(categories);

    // 3. Create media
    const media = new Collection({
        name: "media",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        schema: [
            { name: "file", type: "file", maxSelect: 1, maxSize: 5242880 },
            { name: "file_type", type: "text" },
            { name: "file_name", type: "text" } // Legacy name storage
        ]
    });
    app.save(media);

    // 4. Create products
    const products = new Collection({
        name: "products",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        schema: [
            { name: "name", type: "text", required: true },
            { name: "quantity", type: "number" },
            { name: "buy_price", type: "number" },
            { name: "sale_price", type: "number" },
            { name: "date", type: "date" },
            { name: "categorie_id", type: "relation", collectionId: categories.id, cascadeDelete: false, maxSelect: 1 },
            { name: "media_id", type: "relation", collectionId: media.id, cascadeDelete: false, maxSelect: 1 }
        ]
    });
    app.save(products);

    // 5. Create sales
    const sales = new Collection({
        name: "sales",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        schema: [
            { name: "qty", type: "number" },
            { name: "price", type: "number" },
            { name: "date", type: "date" },
            { name: "product_id", type: "relation", collectionId: products.id, cascadeDelete: false, maxSelect: 1 }
        ]
    });
    app.save(sales);

}, (app) => {
    // Down migration
    try { app.delete(app.findCollectionByNameOrId("sales")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("products")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("media")); } catch(e) {}
    try { app.delete(app.findCollectionByNameOrId("categories")); } catch(e) {}
    
    // Revert users change? Hard to remove field safely without data loss, usually ignored in down.
})
