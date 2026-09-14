/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
  await knex('species').del()

  await knex('species').insert([
    // --- Native ---
    {
      id: 'kiwi',
      name: 'Kiwi',
      type: 'bird',
      hp: 45,
      attack: 10,
      rarity: 'rare',
      status: 'native',
      description:
        'A flightless, nocturnal icon of New Zealand known for its keen sense of smell and strong burrowing legs.',
      fun_fact:
        'Kiwi are the only birds in the world with nostrils at the tip of their beak, letting them sniff out worms underground.',
    },
    {
      id: 'tui',
      name: 'Tūī',
      type: 'bird',
      hp: 30,
      attack: 14,
      rarity: 'common',
      status: 'native',
      description:
        'A energetic honeyeater with distinctive white throat plumes and an exceptionally loud, complex song.',
      fun_fact:
        'Tūī have two voice boxes, letting them sing two different notes at the same time.',
    },
    {
      id: 'kea',
      name: 'Kea',
      type: 'bird',
      hp: 35,
      attack: 18,
      rarity: 'rare',
      status: 'native',
      description:
        'The world’s only alpine parrot, famous for its sharp intelligence, curiosity, and mischievous behavior.',
      fun_fact:
        'Kea are one of the only birds known to solve multi-step puzzles just for fun, not just for food.',
    },
    {
      id: 'kakapo',
      name: 'Kākāpō',
      type: 'bird',
      hp: 50,
      attack: 8,
      rarity: 'legendary',
      status: 'native',
      description:
        'A giant, critically endangered, flightless parrot with moss-green feathers and a gentle demeanor.',
      fun_fact:
        'Kākāpō can live for up to 90 years, making them one of the longest-living birds on Earth.',
    },
    {
      id: 'takahe',
      name: 'Takahē',
      type: 'bird',
      hp: 48,
      attack: 12,
      rarity: 'legendary',
      status: 'native',
      description:
        'A large, flightless alpine bird with vibrant blue and green plumage and a powerful red beak.',
      fun_fact:
        'Takahē were thought to be extinct for 50 years until a small population was rediscovered in 1948.',
    },
    {
      id: 'weta',
      name: 'Wētā',
      type: 'insect',
      hp: 20,
      attack: 16,
      rarity: 'common',
      status: 'native',
      description:
        'An ancient, armored flightless insect native to New Zealand, known for its formidable appearance.',
      fun_fact:
        'Some wētā can survive being frozen solid in winter, then thaw out and carry on as normal.',
    },
    {
      id: 'monarch-butterfly',
      name: 'Monarch Butterfly',
      type: 'insect',
      hp: 10,
      attack: 4,
      rarity: 'common',
      status: 'native',
      description:
        'A bright orange and black butterfly commonly spotted fluttering around swan plants.',
      fun_fact:
        'Monarch butterflies taste with their feet, using sensors on their legs to identify plants.',
    },
    {
      id: 'tuatara',
      name: 'Tuatara',
      type: 'reptile',
      hp: 38,
      attack: 15,
      rarity: 'rare',
      status: 'native',
      description:
        'A prehistoric reptile surviving from the age of the dinosaurs, featuring a unique "third eye".',
      fun_fact:
        'Tuatara can live for over 100 years and keep growing slowly their entire lives.',
    },
    {
      id: 'silver-fern',
      name: 'Silver Fern',
      type: 'plant',
      hp: 25,
      attack: 2,
      rarity: 'common',
      status: 'native',
      description:
        'An iconic tree fern recognizable by the striking silver color on the underside of its fronds.',
      fun_fact:
        'Early Māori travelers used to turn over silver fern fronds to reflect moonlight and mark trail paths at night.',
    },
    {
      id: 'kauri',
      name: 'Kauri',
      type: 'plant',
      hp: 60,
      attack: 3,
      rarity: 'legendary',
      status: 'native',
      description:
        'A majestic, ancient forest giant that can live for over a thousand years.',
      fun_fact:
        'Some living kauri trees in New Zealand are estimated to be over 2,000 years old.',
    },
    {
      id: 'pohutukawa',
      name: 'Pōhutukawa',
      type: 'plant',
      hp: 42,
      attack: 5,
      rarity: 'rare',
      status: 'native',
      description:
        'New Zealand’s Christmas tree, famous for blooming bright crimson flowers along coastal cliffs.',
      fun_fact:
        'Pōhutukawa roots can grip bare rock faces, letting the tree grow sideways out of coastal cliffs.',
    },

    // --- Invasive ---
    {
      id: 'possum',
      name: 'Common Brushtail Possum',
      type: 'mammal',
      hp: 32,
      attack: 17,
      rarity: 'common',
      status: 'invasive',
      description:
        'Introduced nocturnal pest that defoliates native trees and preys on native bird eggs.',
      fun_fact:
        'A single possum can eat around 21,000 leaves a year, stripping native trees bare over time.',
    },
    {
      id: 'stoat',
      name: 'Stoat',
      type: 'mammal',
      hp: 22,
      attack: 22,
      rarity: 'rare',
      status: 'invasive',
      description:
        'A fierce predator introduced to control rabbits that now threatens native wildlife populations.',
      fun_fact:
        'Stoats can squeeze through gaps as small as a 2-centimetre coin, making them almost impossible to fence out.',
    },
    {
      id: 'rainbow-trout',
      name: 'Rainbow Trout',
      type: 'fish',
      hp: 28,
      attack: 13,
      rarity: 'common',
      status: 'invasive',
      description:
        'A popular freshwater sport fish that competes with native galaxiid fish species for food and habitat.',
      fun_fact:
        'Rainbow trout were introduced to New Zealand in the 1880s purely for recreational fishing.',
    },
    {
      id: 'wasp-german',
      name: 'German Wasp',
      type: 'insect',
      hp: 12,
      attack: 20,
      rarity: 'common',
      status: 'invasive',
      description:
        'An aggressive pest that competes heavily with native birds and insects for honeydew.',
      fun_fact:
        'A single German wasp nest can hold over 5,000 wasps by the end of summer.',
    },
    {
      id: 'rabbit',
      name: 'European Rabbit',
      type: 'mammal',
      hp: 18,
      attack: 6,
      rarity: 'common',
      status: 'invasive',
      description:
        'A fast-breeding herbivore that causes extensive pasture damage and soil erosion.',
      fun_fact:
        'A single pair of rabbits can multiply into hundreds of descendants within just one year.',
    },
    {
      id: 'gorse',
      name: 'Gorse',
      type: 'plant',
      hp: 34,
      attack: 9,
      rarity: 'common',
      status: 'invasive',
      description:
        'A prickly, fast-spreading shrub that overtakes farmland and native vegetation.',
      fun_fact:
        'Gorse seeds can stay dormant in soil for over 50 years before sprouting.',
    },
    {
      id: 'old-mans-beard',
      name: "Old Man's Beard",
      type: 'plant',
      hp: 30,
      attack: 7,
      rarity: 'common',
      status: 'invasive',
      description:
        'A fast-growing climbing vine that smothers native forest canopies.',
      fun_fact:
        "Old Man's Beard can grow up to 30cm a week, quickly blanketing entire trees.",
    },
    {
      id: 'rainbow-lorikeet',
      name: 'Rainbow Lorikeet',
      type: 'bird',
      hp: 24,
      attack: 11,
      rarity: 'rare',
      status: 'invasive',
      description:
        'A colorful Australian parrot that competes aggressively with native honeyeaters for food and nest hollows.',
      fun_fact:
        'Rainbow lorikeets have a brush-tipped tongue specially adapted for lapping up nectar.',
    },
    {
      id: 'argentine-ant',
      name: 'Argentine Ant',
      type: 'insect',
      hp: 8,
      attack: 6,
      rarity: 'common',
      status: 'invasive',
      description:
        'An invasive ant species that forms massive supercolonies and displaces native invertebrates.',
      fun_fact:
        'Argentine ant colonies from different areas rarely fight each other, letting them form supercolonies spanning entire regions.',
    },
  ])
}
