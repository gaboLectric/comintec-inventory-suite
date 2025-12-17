/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const supplies = app.findCollectionByNameOrId('supplies');

  if (!supplies) {
    console.log('⚠️ supplies collection not found');
    return;
  }

  const ensureField = (name, factory) => {
    try {
      const existing = supplies.fields.getByName(name);
      if (existing) return;
    } catch (e) {
      // ignore
    }

    supplies.fields.add(factory());
  };

  ensureField('nombre', () => new Field({
    name: 'nombre',
    type: 'text',
    required: true,
  }));

  ensureField('piezas', () => new Field({
    name: 'piezas',
    type: 'number',
    required: true,
    options: { min: 0 },
  }));

  ensureField('stock_deseado', () => new Field({
    name: 'stock_deseado',
    type: 'number',
    required: true,
    options: { min: 0 },
  }));

  // Ensure rules also allow superusers (PocketBase admins) and user_level <= 2
  const adminRule = "@request.auth.id != '' && (@request.auth.collectionName = '_superusers' || @request.auth.user_level <= 2)";
  supplies.listRule = adminRule;
  supplies.viewRule = adminRule;
  supplies.createRule = adminRule;
  supplies.updateRule = adminRule;
  supplies.deleteRule = adminRule;

  app.save(supplies);
  console.log('✅ Ensured supplies fields + rules');
}, (app) => {
  const supplies = app.findCollectionByNameOrId('supplies');
  if (!supplies) return;

  // Rollback: remove fields (best effort)
  try { supplies.fields.removeByName('stock_deseado'); } catch (e) {}
  try { supplies.fields.removeByName('piezas'); } catch (e) {}
  try { supplies.fields.removeByName('nombre'); } catch (e) {}

  app.save(supplies);
});
