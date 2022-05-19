// Since we're using the button.interaction.all trigger we split the files up for orginisation.
// Here we just call those files.
const custom_id = context.params.event.data.custom_id;
await require(`../../helper/buttons/${custom_id}`)(context);