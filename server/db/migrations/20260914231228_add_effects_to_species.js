export async function up(knex) {
  await knex.schema.alterTable('species', (table) => {
    table.string('effect_type') // 'dodge' | 'intimidate' | 'slippery' | 'poison' | 'lifesteal' | 'swarm'
    table.integer('effect_value') // meaning depends on effect_type
    table.string('effect_trigger') // 'passive' | 'on_attack'
  })
}

export async function down(knex) {
  await knex.schema.alterTable('species', (table) => {
    table.dropColumn('effect_type')
    table.dropColumn('effect_value')
    table.dropColumn('effect_trigger')
  })
}
