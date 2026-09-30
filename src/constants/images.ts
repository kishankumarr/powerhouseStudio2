/**
 * Central image registry. Components never contain an image URL; they import from here.
 *
 * Every photo is free-licence Unsplash stock (no Unsplash+ / plus.unsplash.com). It is illustrative
 * only: never caption it as Powerhouse's own work, staff, founders or clients. Alt text lives in
 * src/content/<locale>/images.ts under the key in `altKey`. Theme treatment (duotone, contrast) is
 * applied in CSS, not baked into the files. Verify with `npm run check:images`.
 *
 * `src` is the bare CDN base URL (no query string); the image loader adds sizing params.
 * `width`/`height` are the intrinsic pixel dimensions reported by Unsplash.
 * `focal` is a CSS object-position that keeps the subject in frame when the image is cropped.
 */

export type ImageAsset = {
  src: string // https://images.unsplash.com/photo-... (no query string)
  width: number
  height: number // intrinsic size from the API
  altKey: string // 'images.<key>'
  credit: { name: string; profileUrl: string; photoUrl: string; source: 'Unsplash' }
  focal?: `${number}% ${number}%` // object-position that keeps the subject in frame when cropped
}

export const IMAGES = {
  heroStudio: {
    src: 'https://images.unsplash.com/photo-1727451139462-cd34008cd50b',
    width: 3000,
    height: 2400,
    altKey: 'images.heroStudio',
    credit: {
      name: 'Joshua Wann',
      profileUrl:
        'https://unsplash.com/@joshuawann?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/a-dark-room-with-a-camera-and-lights-nue6Esmpk3M?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '52% 50%',
  },
  heroCollageA: {
    src: 'https://images.unsplash.com/photo-1490971588422-52f6262a237a',
    width: 3648,
    height: 5472,
    altKey: 'images.heroCollageA',
    credit: {
      name: 'Jakob Owens',
      profileUrl:
        'https://unsplash.com/@jakobowens1?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/low-angle-photo-of-black-and-gray-video-camera-HuNenPCNG84?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '50% 45%',
  },
  heroCollageB: {
    src: 'https://images.unsplash.com/photo-1774177613748-2f665beec1c6',
    width: 3536,
    height: 5304,
    altKey: 'images.heroCollageB',
    credit: {
      name: 'gurpreet singh',
      profileUrl:
        'https://unsplash.com/@photofreak0?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/person-holding-camera-at-a-crowded-event-26wtD5V33C8?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '40% 45%',
  },
  heroCollageC: {
    src: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618',
    width: 4240,
    height: 2827,
    altKey: 'images.heroCollageC',
    credit: {
      name: 'Jonathan Velasquez',
      profileUrl:
        'https://unsplash.com/@jonathanvez?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/macro-photography-of-silver-and-black-studio-microphone-condenser-c1ZN57GfDB0?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '68% 55%',
  },
  serviceSocial: {
    src: 'https://images.unsplash.com/photo-1577510247208-a3a1bb017116',
    width: 3000,
    height: 2000,
    altKey: 'images.serviceSocial',
    credit: {
      name: 'Kota Ogi',
      profileUrl: 'https://unsplash.com/@atk420t?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/black-phone-with-gimbal-57ONk_Fk32Q?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '52% 40%',
  },
  serviceVideoProduction: {
    src: 'https://images.unsplash.com/photo-1681137063068-081072cf04b4',
    width: 6005,
    height: 4003,
    altKey: 'images.serviceVideoProduction',
    credit: {
      name: 'Huong Do',
      profileUrl:
        'https://unsplash.com/@huongddn?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/a-group-of-people-standing-around-a-camera-in-the-dark-LP24lfRFKis?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '55% 55%',
  },
  serviceVideoEditing: {
    src: 'https://images.unsplash.com/photo-1546663250-e28569a9706d',
    width: 7952,
    height: 5304,
    altKey: 'images.serviceVideoEditing',
    credit: {
      name: 'Andre Hunter',
      profileUrl: 'https://unsplash.com/@dre0316?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/man-using-computer-inside-room-Y3ShXX0F_9A?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '50% 40%',
  },
  servicePhotography: {
    src: 'https://images.unsplash.com/photo-1641236210747-48bc43e4517f',
    width: 6000,
    height: 4000,
    altKey: 'images.servicePhotography',
    credit: {
      name: 'Lana Mattice',
      profileUrl:
        'https://unsplash.com/@lanamattice?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/a-photographer-taking-a-picture-of-a-woman-in-a-black-outfit-Qy-LgJuED0o?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '58% 50%',
  },
  serviceEventManagement: {
    src: 'https://images.unsplash.com/photo-1708606811579-23b18fc48007',
    width: 5000,
    height: 3333,
    altKey: 'images.serviceEventManagement',
    credit: {
      name: 'Sloshout',
      profileUrl:
        'https://unsplash.com/@sloshout?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/a-decorated-stage-with-a-chandelier-and-chandelier-kzBWQDqYqiM?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '50% 55%',
  },
  serviceEventCoverage: {
    src: 'https://images.unsplash.com/photo-1765344550361-ef69dddc1b76',
    width: 5273,
    height: 3361,
    altKey: 'images.serviceEventCoverage',
    credit: {
      name: 'Pranav Gavali',
      profileUrl:
        'https://unsplash.com/@lensart28?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/camera-operator-filming-a-stage-with-colorful-lights-8jJ-Bw7c_d4?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '40% 45%',
  },
  serviceStudioRentals: {
    src: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea',
    width: 4459,
    height: 2508,
    altKey: 'images.serviceStudioRentals',
    credit: {
      name: 'Alexander Dummer',
      profileUrl:
        'https://unsplash.com/@4dgraphic?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/camera-studio-set-up-aS4Duj2j7r4?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '50% 55%',
  },
  serviceCampaigns: {
    src: 'https://images.unsplash.com/photo-1752650733543-9e5cb5a3a7ad',
    width: 3800,
    height: 2138,
    altKey: 'images.serviceCampaigns',
    credit: {
      name: 'Vitaly Gariev',
      profileUrl:
        'https://unsplash.com/@silverkblack?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/people-are-arranging-photos-on-a-table-7Q31yspx1tQ?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '55% 55%',
  },
  audienceBrands: {
    src: 'https://images.unsplash.com/photo-1763291966927-740c48e6afe5',
    width: 4000,
    height: 6000,
    altKey: 'images.audienceBrands',
    credit: {
      name: 'Harshit Katiyar',
      profileUrl:
        'https://unsplash.com/@harshitkatiyar?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/people-browse-colorful-textiles-at-a-busy-market-stall-BnD28_26kQo?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '50% 45%',
  },
  audienceCreators: {
    src: 'https://images.unsplash.com/photo-1744135995265-a4e0f70822de',
    width: 2136,
    height: 3216,
    altKey: 'images.audienceCreators',
    credit: {
      name: 'Roman Manshin',
      profileUrl:
        'https://unsplash.com/@rmanshin?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/a-phone-records-video-of-a-person-0BhtAC96oe0?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '66% 50%',
  },
  audienceEvents: {
    src: 'https://images.unsplash.com/photo-1761662825950-0d474d850943',
    width: 4160,
    height: 6240,
    altKey: 'images.audienceEvents',
    credit: {
      name: 'Faris Mohammed',
      profileUrl:
        'https://unsplash.com/@pkmfaris?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/silhouetted-crowd-watches-fireworks-explode-in-the-night-sky-KvqOqvVY7Wk?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '45% 55%',
  },
  aboutTeam: {
    src: 'https://images.unsplash.com/photo-1783866706829-ce5a762c70be',
    width: 5547,
    height: 4160,
    altKey: 'images.aboutTeam',
    credit: {
      name: 'Tri Vo',
      profileUrl:
        'https://unsplash.com/@mtmanhtri?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/people-filming-with-a-camera-and-microphone-outdoors-njsu_zbJBR0?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '50% 40%',
  },
  studioPodcast: {
    src: 'https://images.unsplash.com/photo-1650654844295-0d19ab5b468d',
    width: 5907,
    height: 3938,
    altKey: 'images.studioPodcast',
    credit: {
      name: 'dlxmedia.hu',
      profileUrl:
        'https://unsplash.com/@dlxmedia?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/a-desk-with-a-laptop-and-microphones-JJFfe2qRqhE?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '50% 55%',
  },
  contactCoast: {
    src: 'https://images.unsplash.com/photo-1622173324953-adb598835e7a',
    width: 3264,
    height: 2448,
    altKey: 'images.contactCoast',
    credit: {
      name: 'Godwyn Fernandes',
      profileUrl:
        'https://unsplash.com/@godwyn_fernandes?utm_source=powerhouse_studios&utm_medium=referral',
      photoUrl:
        'https://unsplash.com/photos/brown-sand-beach-with-green-trees-and-brown-rocks-2R5KsAVGCNE?utm_source=powerhouse_studios&utm_medium=referral',
      source: 'Unsplash',
    },
    focal: '55% 55%',
  },
} as const satisfies Record<string, ImageAsset>

export type ImageKey = keyof typeof IMAGES
