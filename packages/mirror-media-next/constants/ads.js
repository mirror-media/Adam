import { SECTION_IDS } from '.'

const MICRO_AD_UNITS = {
  HOME: {
    PC: [
      { name: 'NA1_PC_HP', id: '4273362' },
      { name: 'NA2_PC_HP', id: '4273366' },
      { name: 'NA3_PC_HP', id: '4273370' },
    ],
    MB: [
      { name: 'NA1_MB_HP', id: '4273363' },
      { name: 'NA2_MB_HP', id: '4273367' },
      { name: 'NA3_MB_HP', id: '4273371' },
    ],
  },
  LISTING: {
    RWD: [
      { name: 'NA1_RWD_SP', id: '4273364' },
      { name: 'NA2_RWD_SP', id: '4273368' },
      { name: 'NA3_RWD_SP', id: '4273372' },
    ],
  },
  STORY: {
    PC: [
      { name: 'NA1_PC_AP', id: '4276377' },
      { name: 'NA2_PC_AP', id: '4276378' },
      { name: 'NA3_PC_AP', id: '4276379' },
      { name: 'NA4_PC_AP', id: '4297298' },
    ],
    MB: [
      { name: 'NA1_MB_AP', id: '4273365' },
      { name: 'NA2_MB_AP', id: '4273369' },
      { name: 'NA3_MB_AP', id: '4273373' },
      { name: 'NA4_MB_AP', id: '4297297' },
    ],
  },
}

const POP_IN_IDS = {
  RELATED: ['_popIn_recommend'],
  HOT: ['_popIn_recommend_hot', '_popIn_recommend_hot_2'],
}

const DABLE_WIDGET_IDS = {
  MB: '6XgaOJ7N',
  PC: 'GlYwenoy',
}

const {
  member,
  news,
  entertainment,
  businessmoney,
  people,
  international,
  foodtravel,
  mafalda,
  culture,
  carandwatch,
  life,
} = SECTION_IDS

/**
 * page key（比如 global、[news]）註解中各項文字代表的涵義：
 * // page key: spreadsheet 的「分類」欄位, spreadsheet 的「section」欄位
 */

/**
 * ad key（比如 RWD_LOGO、MB_HD）是怎麼決定的：spreadsheet 的「device」欄位_spreadsheet 的「position」欄位
 *
 * 構建 ad key 的程式碼如下：
 * const adKey = [
 *   device === 'm' ? 'MB' : device.toUpperCase(),
 *   position.toUpperCase(),
 * ].join('_')
 */
const GPT_UNITS = {
  // page key: 全站, ros
  global: {
    // ad key
    RWD_LOGO: {
      adUnit: 'mirror_RWD_ros_110x50_logo',
      adSize: [
        [95, 50],
        [1, 1],
      ],
    },
    MB_FS: {
      adUnit: 'mirror_m_ros_320x480_FS',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
    MB_BT: {
      adUnit: 'mirror_m_ros_320x180_BT',
      adSize: [
        [320, 180],
        [1, 1],
      ],
    },
    MB_AD2: {
      adUnit: 'mirror_m_ros_320x480_AD2',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
    MB_INNITY: {
      adUnit: 'mirror_m_ros_320x480_innity',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
    PC_ADBRO: {
      adUnit: 'test_mirror_pc_ros_out_ADBRO',
      adSize: [
        [728, 90],
        [1, 1],
      ],
    },
    MB_ADBRO: {
      adUnit: 'test_mirror_m_ros_out_ADBRO',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
  },

  // page key: 首頁, hp
  home: {
    MB_HD: {
      adUnit: 'mirror_m_hp_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_L1: {
      adUnit: 'mirror_m_hp_300x250_L1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_L2: {
      adUnit: 'mirror_m_hp_300x250_L2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    PC_B1: {
      adUnit: 'mirror_pc_hp_728x90_B1',
      adSize: [
        [728, 90],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_hp_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 其他, oth
  other: {
    MB_HD: {
      adUnit: 'mirror_m_oth_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_oth_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_oth_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_oth_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_oth_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_oth_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_oth_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_oth_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_oth_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_oth_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_oth_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_oth_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_oth_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_oth_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 會員, member
  [member]: {
    MB_HD: {
      adUnit: 'mirror_m_member_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_member_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_member_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_member_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_member_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E2: {
      adUnit: 'mirror_m_member_300x250_E2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_member_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_member_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_member_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_member_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
  },

  // page key: 時事, news
  [news]: {
    MB_HD: {
      adUnit: 'mirror_m_news_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_news_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_news_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_news_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_news_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E2: {
      adUnit: 'mirror_m_news_300x250_E2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_news_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_news_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_news_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_news_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_news_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_news_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_news_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_news_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_news_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 娛樂, ent
  [entertainment]: {
    MB_HD: {
      adUnit: 'mirror_m_ent_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_ent_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_ent_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_ent_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_ent_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_ent_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_ent_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_ent_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_ent_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_ent_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_ent_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_ent_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_ent_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_ent_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 財經理財, fin
  [businessmoney]: {
    MB_HD: {
      adUnit: 'mirror_m_fin_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_fin_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_fin_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_fin_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_fin_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E2: {
      adUnit: 'mirror_m_fin_300x250_E2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_fin_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_fin_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_fin_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_fin_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_fin_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_fin_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_fin_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_fin_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_fin_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 人物, peo
  [people]: {
    MB_HD: {
      adUnit: 'mirror_m_peo_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_peo_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_peo_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_peo_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_peo_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_peo_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_peo_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_peo_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_peo_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_peo_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_peo_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_peo_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_peo_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_peo_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 生活, life
  [life]: {
    MB_HD: {
      adUnit: 'mirror_m_life_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_life_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_life_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_life_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_life_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_life_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_life_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_life_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_life_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_life_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_life_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_life_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_life_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_life_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 影音, video
  videohub: {
    MB_HD: {
      adUnit: 'mirror_m_video_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_video_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_video_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_video_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_video_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_video_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_video_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 國際, int
  [international]: {
    MB_HD: {
      adUnit: 'mirror_m_int_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_int_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_int_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_int_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_int_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_int_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_int_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_int_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_int_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_int_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_int_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_int_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_int_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_int_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 美食旅遊, tra
  [foodtravel]: {
    MB_HD: {
      adUnit: 'mirror_m_tra_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_tra_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_tra_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_tra_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_tra_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E2: {
      adUnit: 'mirror_m_tra_300x250_E2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_L1: {
      adUnit: 'mirror_m_tra_300x250_L1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_tra_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_tra_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_tra_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_tra_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_tra_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_tra_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_tra_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_tra_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_tra_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 瑪法達, mafa
  [mafalda]: {
    MB_HD: {
      adUnit: 'mirror_m_mafa_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_mafa_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_mafa_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_mafa_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_mafa_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_mafa_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_mafa_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_mafa_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_mafa_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_mafa_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_mafa_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_mafa_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_mafa_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_mafa_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 文化, cul
  [culture]: {
    MB_HD: {
      adUnit: 'mirror_m_cul_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_cul_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_cul_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_cul_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_cul_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_cul_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_cul_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_cul_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_cul_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_cul_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_cul_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_cul_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_cul_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_cul_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 汽車鐘錶, wat
  [carandwatch]: {
    MB_HD: {
      adUnit: 'mirror_m_wat_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_wat_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_wat_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_wat_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_wat_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_wat_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_wat_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_wat_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_wat_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_wat_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_FLOATING: {
      adUnit: 'mirror_pc_wat_200x200_floating',
      adSize: [
        [200, 200],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_wat_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_wat_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_wat_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_wat_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },
}

const GPT_AD_NETWORK = '40175602'

export {
  MICRO_AD_UNITS,
  POP_IN_IDS,
  DABLE_WIDGET_IDS,
  GPT_UNITS,
  GPT_AD_NETWORK,
}
