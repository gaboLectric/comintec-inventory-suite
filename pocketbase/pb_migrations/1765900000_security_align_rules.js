/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  // MEDIA: should not be public. Allow any authenticated user to list/view
  // (equipments are visible to all authenticated users and they may expand media).
  {
    const media = app.findCollectionByNameOrId("media");
    if (media) {
      media.listRule = '@request.auth.id != ""';
      media.viewRule = '@request.auth.id != ""';
      app.save(media);
    }
  }

  // OUTPUTS: UI restricts these pages to user_level <= 2.
  // Align backend rules to prevent level-3 users from querying via API directly.
  {
    const collections = ["equipment_outputs", "supply_outputs", "equipment_inputs"]; // inputs are also <=2 in UI
    const staffRule = "@request.auth.id != '' && (@request.auth.collectionName = '_superusers' || @request.auth.user_level <= 2)";

    collections.forEach((name) => {
      const col = app.findCollectionByNameOrId(name);
      if (!col) return;

      col.listRule = staffRule;
      col.viewRule = staffRule;
      col.createRule = staffRule;
      col.updateRule = staffRule;
      col.deleteRule = staffRule;

      app.save(col);
    });
  }

  // USERS: UI restricts /users to admins only (user_level 1).
  // Do not allow any authenticated user to list all users.
  {
    const users = app.findCollectionByNameOrId("users");
    if (users) {
      const adminListRule = "@request.auth.collectionName = '_superusers' || @request.auth.user_level = 1";
      const adminOrSelfViewRule = "@request.auth.collectionName = '_superusers' || @request.auth.user_level = 1 || @request.auth.id = id";

      users.listRule = adminListRule;
      users.viewRule = adminOrSelfViewRule;

      // Keep existing mutation rules (admin can manage; self update allowed).
      app.save(users);
    }
  }
}, (app) => {
  // Revert to previous (less strict) rules as they existed before this migration.
  {
    const media = app.findCollectionByNameOrId("media");
    if (media) {
      media.listRule = null;
      media.viewRule = null;
      app.save(media);
    }
  }

  {
    const collections = ["equipment_outputs", "supply_outputs"]; // previously any authenticated user could list/view
    const anyAuthRule = '@request.auth.id != ""';
    const staffMutRule = "@request.auth.user_level <= 2";

    collections.forEach((name) => {
      const col = app.findCollectionByNameOrId(name);
      if (!col) return;

      col.listRule = anyAuthRule;
      col.viewRule = anyAuthRule;
      col.createRule = staffMutRule;
      col.updateRule = staffMutRule;
      col.deleteRule = staffMutRule;
      app.save(col);
    });
  }

  {
    const equipmentInputs = app.findCollectionByNameOrId("equipment_inputs");
    if (equipmentInputs) {
      const staffRule = "@request.auth.user_level <= 2";
      equipmentInputs.listRule = staffRule;
      equipmentInputs.viewRule = staffRule;
      equipmentInputs.createRule = staffRule;
      equipmentInputs.updateRule = staffRule;
      equipmentInputs.deleteRule = staffRule;
      app.save(equipmentInputs);
    }
  }

  {
    const users = app.findCollectionByNameOrId("users");
    if (users) {
      users.listRule = '@request.auth.id != ""';
      users.viewRule = '@request.auth.id != ""';
      app.save(users);
    }
  }
});
