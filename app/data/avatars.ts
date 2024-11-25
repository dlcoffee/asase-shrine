import { createLookup } from '~/utils/create-lookup'

// todo: maybe dynamic import of avatars folder?
// import traveler from './avatars/traveler.json'
import albedo from './avatars/albedo.json'
import alhaitham from './avatars/alhaitham.json'
import aloy from './avatars/aloy.json'
import amber from './avatars/amber.json'
import arataki_itto from './avatars/arataki_itto.json'
import arlecchino from './avatars/arlecchino.json'
import baizu from './avatars/baizhu.json'
import barbara from './avatars/barbara.json'
import beidou from './avatars/beidou.json'
import bennett from './avatars/bennett.json'
import candace from './avatars/candace.json'
import charlotte from './avatars/charlotte.json'
import chevreuse from './avatars/chevreuse.json'
import chiori from './avatars/chiori.json'
import chongyun from './avatars/chongyun.json'
import clorinde from './avatars/clorinde.json'
import collei from './avatars/collei.json'
import cyno from './avatars/cyno.json'
import dehya from './avatars/dehya.json'
import diluc from './avatars/diluc.json'
import diona from './avatars/diona.json'
import dori from './avatars/dori.json'
import emilie from './avatars/emilie.json'
import eula from './avatars/eula.json'
import faruzan from './avatars/faruzan.json'
import fischl from './avatars/fischl.json'
import freminet from './avatars/freminet.json'
import furina from './avatars/furina.json'
import gaming from './avatars/gaming.json'
import ganyu from './avatars/ganyu.json'
import gorou from './avatars/gorou.json'
import hu_tao from './avatars/hu_tao.json'
import itexingqium from './avatars/xingqiu.json'
import jean from './avatars/jean.json'
import kachina from './avatars/kachina.json'
import kaedehara_kazuha from './avatars/kaedehara_kazuha.json'
import kaeya from './avatars/kaeya.json'
import kamisato_ayaka from './avatars/kamisato_ayaka.json'
import kamisato_ayato from './avatars/kamisato_ayato.json'
import kaveh from './avatars/kaveh.json'
import keqing from './avatars/keqing.json'
import kinich from './avatars/kinich.json'
import kirara from './avatars/kirara.json'
import klee from './avatars/klee.json'
import kujou_sara from './avatars/kujou_sara.json'
import kuki_shinobu from './avatars/kuki_shinobu.json'
import layla from './avatars/layla.json'
import lisa from './avatars/lisa.json'
import lynette from './avatars/lynette.json'
import lyney from './avatars/lyney.json'
import mika from './avatars/mika.json'
import mona from './avatars/mona.json'
import mualani from './avatars/mualani.json'
import nahida from './avatars/nahida.json'
import navia from './avatars/navia.json'
import neuvillette from './avatars/neuvillette.json'
import nilou from './avatars/nilou.json'
import ningguang from './avatars/ningguang.json'
import noelle from './avatars/noelle.json'
import qiqi from './avatars/qiqi.json'
import raiden_shogun from './avatars/raiden_shogun.json'
import razor from './avatars/razor.json'
import rosaria from './avatars/rosaria.json'
import sangonomiya_kokomi from './avatars/sangonomiya_kokomi.json'
import sayu from './avatars/sayu.json'
import sethos from './avatars/sethos.json'
import shenhe from './avatars/shenhe.json'
import shikanoin_heizou from './avatars/shikanoin_heizou.json'
import sigewinne from './avatars/sigewinne.json'
import sucrose from './avatars/sucrose.json'
import tartaglia from './avatars/tartaglia.json'
import thoma from './avatars/thoma.json'
import tighnari from './avatars/tighnari.json'
import traveler_anemo from './avatars/traveler_anemo.json'
import traveler_dendro from './avatars/traveler_dendro.json'
import traveler_electro from './avatars/traveler_electro.json'
import traveler_geo from './avatars/traveler_geo.json'
import venti from './avatars/venti.json'
import wanderer from './avatars/wanderer.json'
import writhoesley from './avatars/wriothesley.json'
import xiangling from './avatars/xiangling.json'
import xianyun from './avatars/xianyun.json'
import xiao from './avatars/xiao.json'
import xilonen from './avatars/xilonen.json'
import xinyan from './avatars/xinyan.json'
import yae_miko from './avatars/yae_miko.json'
import yanfei from './avatars/yanfei.json'
import yaoyao from './avatars/yaoyao.json'
import yelan from './avatars/yelan.json'
import yoimiya from './avatars/yoimiya.json'
import yun_jin from './avatars/yun_jin.json'
import zhongli from './avatars/zhongli.json'

interface Fetter {
  title: string
  detail: string
  constellation: string
  native: string
}

interface Talent {
  [id: string]: {
    type: number
    name: string
    description: string
    icon: string
  }
}

interface Constellation {
  [id: string]: {
    name: string
    description: string
    icon: string
  }
}

export interface Avatar {
  _id: string | number // traveler has an id string
  id: string
  name: string
  icon: string
  ascension: Record<string, number>
  talent: Talent
  constellation: Constellation
  fetter: Fetter
}

export const avatarsList: Avatar[] = [
  // traveler, an exception
  albedo,
  alhaitham,
  aloy,
  amber,
  arataki_itto,
  arlecchino,
  baizu,
  barbara,
  beidou,
  bennett,
  candace,
  charlotte,
  chevreuse,
  chiori,
  chongyun,
  clorinde,
  collei,
  cyno,
  dehya,
  diluc,
  diona,
  dori,
  emilie,
  eula,
  faruzan,
  fischl,
  freminet,
  furina,
  gaming,
  ganyu,
  gorou,
  hu_tao,
  itexingqium,
  jean,
  kachina,
  kaedehara_kazuha,
  kaeya,
  kamisato_ayaka,
  kamisato_ayato,
  kaveh,
  keqing,
  kinich,
  kirara,
  klee,
  kujou_sara,
  kuki_shinobu,
  layla,
  lisa,
  lynette,
  lyney,
  mika,
  mona,
  mualani,
  nahida,
  navia,
  neuvillette,
  nilou,
  ningguang,
  noelle,
  qiqi,
  raiden_shogun,
  razor,
  rosaria,
  sangonomiya_kokomi,
  sayu,
  sethos,
  shenhe,
  shikanoin_heizou,
  sigewinne,
  sucrose,
  tartaglia,
  thoma,
  tighnari,
  traveler_anemo,
  traveler_dendro,
  traveler_electro,
  traveler_geo,
  venti,
  wanderer,
  writhoesley,
  xiangling,
  xianyun,
  xiao,
  xilonen,
  xinyan,
  yae_miko,
  yanfei,
  yaoyao,
  yelan,
  yoimiya,
  yun_jin,
  zhongli,
]

export const avatars = createLookup(avatarsList, 'id')
