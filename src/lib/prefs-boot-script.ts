import {
  DEFAULT_PRESET,
  LAYOUT_IDS,
  PRESET_IDS,
  PRESET_QUERY_PARAM,
  PRESETS,
  PREFS_STORAGE_KEY,
  PREFS_VERSION,
  STYLE_IDS,
  THEME_COLOR,
  THEME_IDS,
} from '@/config/themes'
import { INTRO_STORAGE_KEY } from '@/constants/storage-keys'

/**
 * Inline <head> script that applies saved preferences before first paint.
 * Built from the registry so the allow-lists can never drift from it.
 * Order of precedence: ?preset= in the URL, then localStorage, then the default.
 */
export function buildPrefsBootScript(): string {
  const cfg = {
    key: PREFS_STORAGE_KEY,
    v: PREFS_VERSION,
    q: PRESET_QUERY_PARAM,
    presets: PRESETS,
    def: DEFAULT_PRESET,
    ids: { preset: PRESET_IDS, theme: THEME_IDS, layout: LAYOUT_IDS, style: STYLE_IDS },
    color: THEME_COLOR,
    intro: INTRO_STORAGE_KEY,
  }
  return `(function(c){try{
var d=document.documentElement,p=c.presets[c.def],s={preset:c.def,theme:p.theme,layout:p.layout,style:p.style};
function ok(k,v){return c.ids[k].indexOf(v)>-1}
try{var raw=localStorage.getItem(c.key);if(raw){var o=JSON.parse(raw);if(o&&o.v===c.v&&ok('theme',o.theme)&&ok('layout',o.layout)&&ok('style',o.style)){s={preset:ok('preset',o.preset)?o.preset:'custom',theme:o.theme,layout:o.layout,style:o.style}}}}catch(e){}
var q=new URLSearchParams(location.search).get(c.q);
if(q&&ok('preset',q)){var qp=c.presets[q];s={preset:q,theme:qp.theme,layout:qp.layout,style:qp.style};try{localStorage.setItem(c.key,JSON.stringify({preset:s.preset,theme:s.theme,layout:s.layout,style:s.style,v:c.v}))}catch(e){}}
d.dataset.theme=s.theme;d.dataset.layout=s.layout;d.dataset.style=s.style;d.dataset.preset=s.preset;
var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',c.color[s.theme]);
try{if(sessionStorage.getItem(c.intro))d.dataset.intro='done'}catch(e){}
}catch(e){}})(${JSON.stringify(cfg)});`
}
