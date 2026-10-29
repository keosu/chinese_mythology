import type { MythEvent } from './types';

export const events: MythEvent[] = [
  // 壹 混沌创世
  {
    id: 'ev-hundun', era: 'chaos', order: 1, title: '七窍凿而浑沌死',
    summary: '倏与忽为报答中央之帝浑沌，日凿一窍，七日而浑沌死——原初的整全被打破，时间开始流动。',
    participants: ['hundun'],
    quote: { text: '日凿一窍，七日而浑沌死。', source: '庄子·应帝王' },
  },
  {
    id: 'ev-pangu', era: 'chaos', order: 2, title: '盘古开天辟地',
    summary: '盘古生于混沌鸡子之中，一万八千岁后天地开辟，阳清为天、阴浊为地；他顶天立地，又一万八千岁，天地始定。',
    participants: ['pangu', 'hundun'],
    quote: { text: '天日高一丈，地日厚一丈，盘古日长一丈。', source: '三五历纪' },
  },
  {
    id: 'ev-huasheng', era: 'chaos', order: 3, title: '垂死化身',
    summary: '盘古死后，气化风云，声为雷霆，双眼化为日月，四肢化为四极五岳，血液化为江河，万物由此而生。',
    participants: ['pangu'],
    quote: { text: '左眼为日，右眼为月，四肢五体为四极五岳，血液为江河。', source: '五运历年记' },
  },
  {
    id: 'ev-zhulong', era: 'chaos', order: 4, title: '烛龙衔烛照幽冥',
    summary: '钟山之神烛龙睁眼为昼、闭眼为夜，吹为冬、呼为夏，照亮太阳无法抵达的西北幽冥之地。',
    participants: ['zhulong'],
  },
  {
    id: 'ev-shiri', era: 'chaos', order: 5, title: '羲和浴日 · 常羲浴月',
    summary: '帝俊之妻羲和生十日，在甘渊为太阳沐浴；常羲生十二月。十日栖于扶桑，由金乌轮流负载升空。',
    participants: ['dijun', 'xihe', 'changxi', 'jinwu', 'fusang'],
  },
  {
    id: 'ev-guixu', era: 'chaos', order: 6, title: '巨鳌负山 · 归墟五岛',
    summary: '渤海之东有无底之谷归墟，五座仙山浮于其上。天帝命禺强使十五巨鳌举首戴之，后龙伯巨人钓走六鳌，二山沉没。',
    participants: ['guixu', 'yuqiang', 'ao', 'darenguo'],
  },
  // 贰 抟土造人
  {
    id: 'ev-huaxu', era: 'humanity', order: 1, title: '华胥履迹',
    summary: '华胥氏在雷泽踏雷神巨迹而有孕，生下伏羲——中国神话中最早的“感生”故事。',
    participants: ['huaxu', 'leishen', 'fuxi'],
    quote: { text: '大迹出雷泽，华胥履之，生宓牺。', source: '诗含神雾' },
  },
  {
    id: 'ev-zaoren', era: 'humanity', order: 2, title: '女娲抟土造人',
    summary: '女娲抟黄土作人，力不暇供，乃引绳于泥中，挥洒成人。人类从此诞生。',
    participants: ['nvwa'],
    quote: { text: '女娲抟黄土作人。剧务，力不暇供，乃引绳于泥中，举以为人。', source: '风俗通义' },
  },
  {
    id: 'ev-hunyin', era: 'humanity', order: 3, title: '伏羲女娲兄妹成婚',
    summary: '洪水过后世间只剩伏羲、女娲兄妹，二人以烟合、滚磨问天，天意许之，遂结为夫妇，繁衍人类。',
    participants: ['fuxi', 'nvwa'],
  },
  {
    id: 'ev-bagua', era: 'humanity', order: 4, title: '伏羲画卦',
    summary: '龙马负图出于河，伏羲仰观天文、俯察地理，始作八卦，以通神明之德、类万物之情。',
    participants: ['fuxi', 'hetu'],
  },
  {
    id: 'ev-butian', era: 'humanity', order: 5, title: '女娲补天',
    summary: '四极废、九州裂，天不兼覆、地不周载。女娲炼五色石补苍天，断鳌足立四极，杀黑龙济冀州，积芦灰止淫水。',
    participants: ['nvwa', 'wuseshi', 'ao'],
    quote: { text: '于是女娲炼五色石以补苍天，断鳌足以立四极。', source: '淮南子·览冥训' },
  },
  // 叁 三皇五帝
  {
    id: 'ev-huozhong', era: 'sovereigns', order: 1, title: '燧人取火 · 有巢构木',
    summary: '燧人氏钻燧取火，教民熟食；有巢氏构木为巢，以避群害。人类迈出文明的第一步。',
    participants: ['suiren', 'youchao'],
  },
  {
    id: 'ev-baicao', era: 'sovereigns', order: 2, title: '神农尝百草',
    summary: '神农氏教民播种五谷，尝百草之滋味，一日而遇七十毒，开农耕与医药之先河。',
    participants: ['yandi'],
  },
  {
    id: 'ev-banquan', era: 'sovereigns', order: 3, title: '阪泉之战',
    summary: '同出少典的黄帝与炎帝战于阪泉之野，三战然后得其志。炎黄二族合而为一，“炎黄子孙”由此而来。',
    participants: ['huangdi', 'yandi', 'shaodian'],
  },
  {
    id: 'ev-zhuolu', era: 'sovereigns', order: 4, title: '涿鹿之战',
    summary: '蚩尤作兵伐黄帝。应龙蓄水，蚩尤请风伯雨师纵大风雨；黄帝下天女魃，雨止，遂杀蚩尤。',
    participants: ['huangdi', 'chiyou', 'yinglong', 'nvba', 'fengbo', 'yushi', 'zhuolu', 'kui'],
    quote: { text: '黄帝乃下天女曰魃，雨止，遂杀蚩尤。', source: '山海经·大荒北经' },
  },
  {
    id: 'ev-xingtian', era: 'sovereigns', order: 5, title: '刑天舞干戚',
    summary: '刑天与帝争神，被断首葬于常羊山，仍以乳为目、以脐为口，操干戚而舞。',
    participants: ['xingtian', 'huangdi'],
  },
  {
    id: 'ev-cangjie', era: 'sovereigns', order: 6, title: '仓颉造字 · 嫘祖养蚕',
    summary: '仓颉观鸟兽之迹而造文字，天雨粟、鬼夜哭；嫘祖始教民育蚕缫丝。黄帝时代的文明大爆发。',
    participants: ['cangjie', 'leizu', 'huangdi', 'baize'],
  },
  {
    id: 'ev-juedi', era: 'sovereigns', order: 7, title: '绝地天通',
    summary: '颛顼命重司天以属神、黎司地以属民，断绝人神杂糅，天上与人间从此分开。',
    participants: ['zhuanxu', 'zhurong'],
  },
  {
    id: 'ev-buzhou', era: 'sovereigns', order: 8, title: '共工怒触不周山',
    summary: '共工与颛顼争帝失败，怒触不周山，天柱折、地维绝，天倾西北，地不满东南。',
    participants: ['gonggong', 'zhuanxu', 'buzhou'],
    quote: { text: '天倾西北，故日月星辰移焉；地不满东南，故水潦尘埃归焉。', source: '淮南子·天文训' },
  },
  {
    id: 'ev-shenglong', era: 'sovereigns', order: 9, title: '黄帝铸鼎乘龙',
    summary: '黄帝采首山铜，铸鼎于荆山之下。鼎成，有龙垂胡髯下迎，黄帝骑龙升天。',
    participants: ['huangdi'],
  },
  // 肆 古蜀
  {
    id: 'ev-cancong', era: 'shu', order: 1, title: '蚕丛开国',
    summary: '纵目的蚕丛从岷山石室迁居成都平原，始称蜀王，教民养蚕，衣青衣巡行乡里。',
    participants: ['cancong', 'zongmu'],
  },
  {
    id: 'ev-yufu', era: 'shu', order: 2, title: '柏灌鱼凫 · 神化不死',
    summary: '柏灌、鱼凫相继为王，“各数百岁，皆神化不死”；鱼凫田于湔山，忽得仙道。',
    participants: ['baiguan', 'yufu', 'jinzhang'],
  },
  {
    id: 'ev-sanxingdui', era: 'shu', order: 3, title: '三星堆祭祀',
    summary: '古蜀人铸造青铜神树、纵目面具与金杖，在神树下祭祀太阳与祖先——这一切在三千年后重见天日。',
    participants: ['shenshu', 'zongmu', 'jinzhang', 'taiyangshenniao', 'jianmu', 'fusang'],
  },
  {
    id: 'ev-duyu', era: 'shu', order: 4, title: '杜宇称帝 · 教民务农',
    summary: '杜宇自天而降，自立为蜀王，号望帝，教民务农，蜀人至今“先祭杜主，后乃播种”。',
    participants: ['duyu'],
  },
  {
    id: 'ev-bieling', era: 'shu', order: 5, title: '鳖灵复活 · 凿山治水',
    summary: '荆人鳖灵死后尸随江水上至郫而复活，为望帝之相，决玉垒山以除水害。',
    participants: ['kaiming', 'duyu'],
  },
  {
    id: 'ev-dujuan', era: 'shu', order: 6, title: '望帝禅位 · 杜鹃啼血',
    summary: '望帝法尧舜禅让之义，传位于开明，隐于西山；时值二月，子鹃鸟鸣，蜀人悲之——望帝魂化杜鹃。',
    participants: ['duyu', 'kaiming', 'dujuan'],
    quote: { text: '望帝春心托杜鹃。', source: '李商隐·锦瑟' },
  },
  {
    id: 'ev-wuding', era: 'shu', order: 7, title: '五丁开道 · 古蜀终章',
    summary: '秦惠王以“石牛便金”诱蜀，五丁开辟金牛道；后五丁拔蛇崩山而死，秦军沿道入蜀，开明王朝覆灭。',
    participants: ['wuding', 'kaiming'],
  },
  {
    id: 'ev-dujiangyan', era: 'shu', order: 8, title: '李冰修都江堰',
    summary: '秦蜀郡守李冰斗江神、修都江堰，成都平原“水旱从人”。他与其子被神化，演为川主与灌口二郎。',
    participants: ['libing', 'erlang'],
  },
  // 伍 英雄与治水
  {
    id: 'ev-shiri-bingchu', era: 'heroes', order: 1, title: '十日并出',
    summary: '尧之时，十日并出，焦禾稼、杀草木，猰貐、凿齿、九婴、大风、封豨、修蛇皆为民害。',
    participants: ['yao', 'jinwu', 'yayu', 'jiuying', 'bashe'],
  },
  {
    id: 'ev-sheri', era: 'heroes', order: 2, title: '羿射九日 · 除六害',
    summary: '羿受帝俊所赐彤弓素矰，上射十日，下杀猰貐，断修蛇于洞庭，禽封豨于桑林，万民皆喜。',
    participants: ['yi', 'dijun', 'jinwu', 'yayu', 'jiuying', 'bashe', 'yao'],
    quote: { text: '上射十日而下杀猰貐，断修蛇于洞庭，禽封豨于桑林。', source: '淮南子·本经训' },
  },
  {
    id: 'ev-benyue', era: 'heroes', order: 3, title: '嫦娥奔月',
    summary: '羿请不死之药于西王母，嫦娥窃以奔月，居于广寒，与玉兔、桂树为伴。羿后被弟子逢蒙所杀。',
    participants: ['change', 'yi', 'xiwangmu', 'busiyao', 'guanghan', 'yutu', 'fengmeng'],
  },
  {
    id: 'ev-kuafu', era: 'heroes', order: 4, title: '夸父逐日',
    summary: '夸父与日逐走，渴饮河渭，河渭不足，北饮大泽，未至，道渴而死，弃其杖化为邓林。',
    participants: ['kuafu', 'jinwu', 'houtu'],
  },
  {
    id: 'ev-jingwei', era: 'heroes', order: 5, title: '精卫填海',
    summary: '炎帝少女女娃溺于东海，化为精卫，常衔西山之木石以堙东海。',
    participants: ['jingwei', 'yandi'],
    quote: { text: '精卫衔微木，将以填沧海。', source: '陶渊明·读山海经' },
  },
  {
    id: 'ev-gun', era: 'heroes', order: 6, title: '鲧窃息壤',
    summary: '洪水滔天，鲧不待帝命，窃息壤以堙洪水。帝令祝融杀鲧于羽郊，鲧尸三年不腐。',
    participants: ['gun', 'xirang', 'zhurong', 'yao'],
  },
  {
    id: 'ev-yuzhishui', era: 'heroes', order: 7, title: '大禹治水',
    summary: '禹生于鲧腹，改堵为疏，应龙画地、玄龟负泥，居外十三年，三过家门而不入。',
    participants: ['yu', 'gun', 'yinglong', 'xuangui', 'boyi', 'tushan'],
  },
  {
    id: 'ev-xiangliu', era: 'heroes', order: 8, title: '禹杀相柳 · 锁无支祁',
    summary: '禹诛杀共工之臣九首相柳，于桐柏山擒淮涡水神无支祁锁于龟山之下，又于会稽戮防风氏。',
    participants: ['yu', 'xiangliu', 'gonggong', 'wuzhiqi', 'fangfeng'],
  },
  {
    id: 'ev-tushan', era: 'heroes', order: 9, title: '涂山之会 · 石破生启',
    summary: '禹遇九尾白狐，娶涂山氏女娇。禹化熊开山，女娇惊而化石，石破北方而生启。',
    participants: ['yu', 'tushan', 'qi', 'jiuweihu'],
  },
  {
    id: 'ev-jiuding', era: 'heroes', order: 10, title: '禹铸九鼎 · 定九州',
    summary: '洪水平定，禹划天下为九州，收九牧之金铸九鼎，图写百物神奸，使民入山林川泽不逢不若。',
    participants: ['yu', 'jiuding', 'qi'],
  },
  {
    id: 'ev-shanrang', era: 'heroes', order: 11, title: '尧舜禹禅让',
    summary: '尧不传其子丹朱而禅位于舜，舜又禅位于治水有功的禹；禹死后启继位，“公天下”变为“家天下”。',
    participants: ['yao', 'shun', 'yu', 'qi', 'ehuang'],
  },
  {
    id: 'ev-xiangfei', era: 'heroes', order: 12, title: '湘妃泪竹',
    summary: '舜南巡死于苍梧，娥皇女英追至湘水，泪洒竹上尽成斑，投水而为湘水之神。',
    participants: ['ehuang', 'shun'],
  },
  // 陆 天庭神系
  {
    id: 'ev-wufang', era: 'pantheon', order: 1, title: '五方帝 · 五行神系',
    summary: '战国秦汉间，古神被编入五行：东青帝太昊佐句芒，南赤帝炎帝佐祝融，中黄帝佐后土，西白帝少昊佐蓐收，北黑帝颛顼佐玄冥。',
    participants: ['fuxi', 'yandi', 'huangdi', 'shaohao', 'zhuanxu', 'goumang', 'zhurong', 'houtu', 'rushou', 'yuqiang'],
  },
  {
    id: 'ev-sixiang', era: 'pantheon', order: 2, title: '四象列宿',
    summary: '二十八宿分为四组：东方青龙、西方白虎、南方朱雀、北方玄武，守护天之四方。',
    participants: ['qinglong', 'baihu', 'zhuque', 'xuanwu'],
  },
  {
    id: 'ev-xiwangmu', era: 'pantheon', order: 3, title: '西王母的蜕变',
    summary: '从《山海经》“豹尾虎齿”的司厉之神，到《穆天子传》瑶池宴饮的女王，再到汉代掌不死药的仙母，最终成为瑶池金母。',
    participants: ['xiwangmu', 'dongwanggong', 'jiuweihu', 'yutu'],
  },
  {
    id: 'ev-sanqing', era: 'pantheon', order: 4, title: '三清四御 · 道教神谱',
    summary: '南北朝至唐宋，道教确立三清（元始、灵宝、道德）居最高天，玉皇、紫微、勾陈、后土为四御。',
    participants: ['yuanshi', 'lingbao', 'daode', 'yuhuang', 'ziwei', 'gouchen', 'houtu', 'tianting'],
  },
  {
    id: 'ev-difu', era: 'pantheon', order: 5, title: '泰山治鬼 · 十殿阎罗',
    summary: '汉代“泰山治鬼”，佛教带来阎罗与地狱，道教构建酆都；三者融合为“阴曹地府”，善恶有报、六道轮回。',
    participants: ['dongyue', 'fengdu', 'yanluo', 'dizang', 'difu', 'mengpo', 'wuchang'],
  },
  {
    id: 'ev-fengshen', era: 'pantheon', order: 6, title: '姜子牙封神',
    summary: '明代《封神演义》：阐截二教卷入武王伐纣，战后姜子牙登封神台，册封三百六十五位正神。',
    participants: ['jiangziya', 'yuanshi', 'tongtian', 'hongjun', 'wenzhong', 'caishen', 'nezha', 'lijing', 'erlang'],
  },
  {
    id: 'ev-naohai', era: 'pantheon', order: 7, title: '哪吒闹海',
    summary: '哪吒打死巡海夜叉与龙王三太子，为免连累父母剔骨还父、削肉还母，太乙真人以莲花为其重塑真身。',
    participants: ['nezha', 'longwang', 'lijing'],
  },
  {
    id: 'ev-naotiangong', era: 'pantheon', order: 8, title: '大闹天宫',
    summary: '孙悟空取金箍棒、销生死簿、偷蟠桃金丹，大闹天宫，与二郎神斗法被擒，八卦炉中炼出火眼金睛，终被压五行山下。',
    participants: ['sunwukong', 'yuhuang', 'erlang', 'daode', 'xiwangmu', 'jingubang', 'nezha', 'lijing'],
  },
  {
    id: 'ev-queqiao', era: 'pantheon', order: 9, title: '鹊桥相会',
    summary: '织女私嫁牛郎，被王母召回，金簪划出银河。每年七夕，喜鹊架桥，夫妻相会。',
    participants: ['zhinv', 'niulang', 'xiwangmu'],
  },
  // 柒 山海志怪
  {
    id: 'ev-shanjing', era: 'shanhai', order: 1, title: '五藏山经',
    summary: '南、西、北、东、中五方，四百余座山。“又东三百里，曰青丘之山……有兽焉，其状如狐而九尾。”',
    participants: ['jiuweihu', 'bifang', 'fenghuang', 'lushu', 'qiongqi', 'taotie', 'dangkang', 'luwu'],
  },
  {
    id: 'ev-haiwai', era: 'shanhai', order: 2, title: '海外诸国',
    summary: '羽民、贯胸、不死、长臂、女子、奇肱、一目、君子……海外经描绘了一个奇异民族环绕的世界。',
    participants: ['yumin', 'guanxiong', 'busimin', 'changbi', 'nvziguo', 'qigong', 'yimu', 'junzi'],
  },
  {
    id: 'ev-sixiong', era: 'shanhai', order: 3, title: '流放四凶',
    summary: '舜流放浑敦、穷奇、梼杌、饕餮四凶族于四裔，“以御螭魅”。四凶后来成为四大凶兽。',
    participants: ['shun', 'hundun', 'qiongqi', 'taowu', 'taotie'],
  },
  {
    id: 'ev-soushen', era: 'shanhai', order: 4, title: '搜神记 · 人鬼之间',
    summary: '干宝“发明神道之不诬”：盘瓠、干将莫邪、宋定伯卖鬼、李寄斩蛇、董永遇仙……',
    participants: ['panhu', 'ganjiang', 'songdingbo', 'liji', 'dongyong'],
  },
  {
    id: 'ev-liaozhai', era: 'shanhai', order: 5, title: '聊斋 · 狐鬼有情',
    summary: '蒲松龄“写鬼写妖高人一等”：聂小倩、婴宁、画皮——狐鬼花妖比人更有情义。',
    participants: ['niexiaoqian', 'yingning', 'huapi'],
  },
];
