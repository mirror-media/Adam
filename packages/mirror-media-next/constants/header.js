/**
 * Default data used when premium header cannot fetch data successfully.
 */
const DEFAULT_PREMIUM_SECTIONS_DATA = [
  {
    id: '9',
    name: '財經理財',
    slug: 'businessmoney',
    categories: [
      {
        id: '19',
        name: '理財',
        slug: 'money',
      },
    ],
  },
  {
    id: '1',
    name: '美食旅遊',
    slug: 'foodtravel',
    categories: [
      {
        id: '1',
        name: '美食焦點',
        slug: 'food',
      },
      {
        id: '2',
        name: '旅行台灣',
        slug: 'traveltaiwan',
      },
      {
        id: '7',
        name: '看見世界',
        slug: 'seetheworld',
      },
      {
        id: '8',
        name: '廚房密技',
        slug: 'kitchenplay',
      },
      {
        id: '35',
        name: '好酒情報',
        slug: 'wine',
      },
    ],
  },
  {
    id: '5',
    name: '娛樂',
    slug: 'entertainment',
    categories: [
      {
        id: '25',
        name: '鏡大咖',
        slug: 'celebrity',
      },
      {
        id: '27',
        name: '影劇專欄',
        slug: 'column',
      },
    ],
  },
  {
    id: '7',
    name: '人物',
    slug: 'people',
    categories: [
      {
        id: '49',
        name: '一鏡到底',
        slug: 'somebody',
      },
      {
        id: '51',
        name: '心內話',
        slug: 'truth',
      },
      {
        id: '50',
        name: '鏡相人間',
        slug: 'world',
      },
      {
        id: '52',
        name: '財經人物',
        slug: 'mogul',
      },
    ],
  },
  {
    id: '15',
    name: '新聞深探',
    slug: 'timesquare',
    categories: [
      {
        id: '94',
        name: '時代現場',
        slug: 'timesquare',
      },
      {
        id: '112',
        name: '完整全文',
        slug: 'dig',
      },
    ],
  },
]

/**
 * Default data used when premium header cannot fetch data successfully.
 */
const DEFAULT_NORMAL_SECTIONS_DATA = [
  {
    order: 1,
    type: 'section',
    slug: 'member',
    name: '會員專區',
    categories: [
      { id: '1', slug: 'food', name: '美食焦點', isMemberOnly: true },
      { id: '2', slug: 'traveltaiwan', name: '旅行台灣', isMemberOnly: true },
      { id: '7', slug: 'seetheworld', name: '看見世界', isMemberOnly: true },
      { id: '8', slug: 'kitchenplay', name: '廚房密技', isMemberOnly: true },
      { id: '19', slug: 'money', name: '理財', isMemberOnly: true },
      { id: '25', slug: 'celebrity', name: '鏡大咖', isMemberOnly: true },
      { id: '27', slug: 'column', name: '影劇專欄', isMemberOnly: true },
      { id: '35', slug: 'wine', name: '好酒情報', isMemberOnly: true },
      { id: '49', slug: 'somebody', name: '一鏡到底', isMemberOnly: true },
      { id: '50', slug: 'world', name: '鏡相人間', isMemberOnly: true },
      { id: '51', slug: 'truth', name: '心內話', isMemberOnly: true },
      { id: '52', slug: 'mogul', name: '財經人物', isMemberOnly: true },
      { id: '94', slug: 'timesquare', name: '時代現場', isMemberOnly: true },
      { id: '112', slug: 'mg', name: '完整全文', isMemberOnly: false },
    ],
  },
  {
    order: 2,
    type: 'category',
    slug: 'news',
    name: '焦點',
    isMemberOnly: false,
    sections: ['news'],
  },
  {
    order: 3,
    type: 'section',
    slug: 'entertainment',
    name: '娛樂',
    categories: [
      { id: '24', slug: 'latestnews', name: '娛樂頭條', isMemberOnly: false },
      { id: '36', slug: 'insight', name: '娛樂透視', isMemberOnly: false },
      { id: '48', slug: 'comic', name: '動漫遊戲', isMemberOnly: false },
      { id: '61', slug: 'rookie', name: '試鏡間', isMemberOnly: false },
      { id: '62', slug: 'fashion', name: '穿衣鏡', isMemberOnly: false },
      { id: '63', slug: 'madam', name: '蘭蘭夫人', isMemberOnly: false },
      {
        id: '64',
        slug: 'superstar',
        name: '我眼中的大明星',
        isMemberOnly: false,
      },
    ],
  },
  {
    order: 4,
    type: 'category',
    slug: 'political',
    name: '政治',
    isMemberOnly: false,
    sections: ['news'],
  },
  {
    order: 5,
    type: 'category',
    slug: 'business',
    name: '財經',
    isMemberOnly: false,
    sections: ['businessmoney'],
  },
  {
    order: 6,
    type: 'category',
    slug: 'city-news',
    name: '社會',
    isMemberOnly: false,
    sections: ['news'],
  },
  {
    order: 7,
    type: 'section',
    slug: 'life',
    name: '生活',
    categories: [
      { id: '46', slug: 'life', name: '萬象', isMemberOnly: false },
      {
        id: '74',
        slug: 'knowledgeprogram',
        name: '知識好好玩',
        isMemberOnly: false,
      },
      { id: '75', slug: 'bookreview', name: '書評', isMemberOnly: false },
      { id: '76', slug: 'culture-column', name: '專欄', isMemberOnly: false },
      { id: '77', slug: 'poem', name: '詩', isMemberOnly: false },
      { id: '95', slug: 'booksummary', name: '鏡書摘', isMemberOnly: false },
      { id: '109', slug: 'vioce', name: '好聽人物', isMemberOnly: false },
    ],
  },
  {
    order: 8,
    type: 'category',
    slug: 'global',
    name: '國際要聞',
    isMemberOnly: false,
    sections: ['news', 'international'],
  },
  {
    order: 9,
    type: 'section',
    slug: 'carandwatch',
    name: '汽車鐘錶',
    categories: [
      { id: '11', slug: 'watchfocus', name: '錶壇焦點', isMemberOnly: false },
      {
        id: '12',
        slug: 'watchfeature',
        name: '鐘錶專題',
        isMemberOnly: false,
      },
      { id: '15', slug: 'blog', name: '編輯幕後', isMemberOnly: false },
      { id: '56', slug: 'car_focus', name: '車壇焦點', isMemberOnly: false },
      {
        id: '57',
        slug: 'car_features',
        name: '鏡車專題',
        isMemberOnly: false,
      },
      {
        id: '58',
        slug: 'test_drives',
        name: '靚俥試駕',
        isMemberOnly: false,
      },
      { id: '59', slug: 'pit_zone', name: '鏡車經', isMemberOnly: false },
      {
        id: '107',
        slug: 'newwatches2021',
        name: '新錶2021',
        isMemberOnly: false,
      },
      { id: '111', slug: 'luxury', name: '奢華誌', isMemberOnly: false },
      {
        id: '114',
        slug: 'newwatches2022',
        name: '新錶2022',
        isMemberOnly: false,
      },
      {
        id: '115',
        slug: 'newwatches2023',
        name: '新錶2023',
        isMemberOnly: false,
      },
    ],
  },
  {
    order: 10,
    type: 'section',
    slug: 'mafalda',
    name: '瑪法達',
    categories: [],
  },
]

export { DEFAULT_PREMIUM_SECTIONS_DATA, DEFAULT_NORMAL_SECTIONS_DATA }
