/**
 * One-off backfill for users whose created_at is NULL (accounts created
 * before created_at was set on insert). Uses each user's earliest card
 * as a proxy for signup date, since the real signup timestamp was never
 * recorded. Users with no cards yet fall back to "now" at migration time.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  const usersMissingDate = await knex('users').whereNull('created_at').select('id')

  for (const { id } of usersMissingDate) {
    const earliestCard = await knex('cards')
      .where({ user_id: id })
      .orderBy('created_at', 'asc')
      .select('created_at')
      .first()

    await knex('users')
      .where({ id })
      .update({ created_at: earliestCard?.created_at ?? knex.fn.now() })
  }
}

export async function down(knex) {
  // no-op
}