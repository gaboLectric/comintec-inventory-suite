/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Add fecha field to equipment_outputs if missing
  const eqOutputs = app.findCollectionByNameOrId("equipment_outputs");
  if (eqOutputs) {
    const fechaField = eqOutputs.fields.getByName("fecha");
    if (!fechaField) {
      eqOutputs.fields.add(new Field({
        name: "fecha",
        type: "date",
        required: false
      }));
      app.save(eqOutputs);
      console.log("Added fecha field to equipment_outputs");
    }
  }

  // Add fecha field to supply_outputs if missing
  const supOutputs = app.findCollectionByNameOrId("supply_outputs");
  if (supOutputs) {
    const fechaField = supOutputs.fields.getByName("fecha");
    if (!fechaField) {
      supOutputs.fields.add(new Field({
        name: "fecha",
        type: "date",
        required: false
      }));
      app.save(supOutputs);
      console.log("Added fecha field to supply_outputs");
    }
  }
}, (app) => {
  // No rollback needed - we're just ensuring fields exist
})
