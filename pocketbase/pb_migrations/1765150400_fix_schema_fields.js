/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // 1. Categories
    const categories = app.findCollectionByNameOrId("categories");
    categories.fields.add(new Field({ name: "name", type: "text", required: true }));
    app.save(categories);

    // 2. Media
    const media = app.findCollectionByNameOrId("media");
    media.fields.add(new Field({ name: "file", type: "file", maxSelect: 1, maxSize: 5242880 }));
    media.fields.add(new Field({ name: "file_type", type: "text" }));
    media.fields.add(new Field({ name: "file_name", type: "text" }));
    app.save(media);

    // 3. Products
    const products = app.findCollectionByNameOrId("products");
    products.fields.add(new Field({ name: "name", type: "text", required: true }));
    products.fields.add(new Field({ name: "quantity", type: "number" }));
    products.fields.add(new Field({ name: "buy_price", type: "number" }));
    products.fields.add(new Field({ name: "sale_price", type: "number" }));
    products.fields.add(new Field({
        name: "categorie_id",
        type: "relation",
        collectionId: categories.id,
        maxSelect: 1
    }));
    products.fields.add(new Field({
        name: "media_id",
        type: "relation",
        collectionId: media.id,
        maxSelect: 1
    }));
    products.fields.add(new Field({ name: "date", type: "date" }));
    app.save(products);

    // 4. Sales
    const sales = app.findCollectionByNameOrId("sales");
    sales.fields.add(new Field({
        name: "product_id",
        type: "relation",
        collectionId: products.id,
        maxSelect: 1
    }));
    sales.fields.add(new Field({ name: "qty", type: "number" }));
    sales.fields.add(new Field({ name: "price", type: "number" }));
    sales.fields.add(new Field({ name: "date", type: "date" }));
    app.save(sales);

}, (app) => {
    // Revert by removing fields? 
    // Since this is a fix, we might not need strict revert logic for now, 
    // but ideally we would remove the fields.
    // However, removing fields is destructive.
})
