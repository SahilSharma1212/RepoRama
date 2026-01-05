// folderColors.ts

export interface NodeColor {
background: string;
border: string;
}
export interface FolderColor {
background: string;
border: string;
}

export const folderColors: Record<string, FolderColor> = {

// CORE / ENTRY / SOURCE

src: { background: "#3498db", border: "#1f5f8b" },
app: { background: "#3498db", border: "#1f5f8b" },
core: { background: "#3498db", border: "#1f5f8b" },


// UI / PRESENTATION

components: { background: "#2980b9", border: "#1c5980" },
pages: { background: "#2980b9", border: "#1c5980" },
screens: { background: "#2980b9", border: "#1c5980" },
views: { background: "#2980b9", border: "#1c5980" },
layouts: { background: "#2980b9", border: "#1c5980" },


// STATIC / ASSETS

public: { background: "#16a085", border: "#0e6655" },
assets: { background: "#16a085", border: "#0e6655" },
static: { background: "#16a085", border: "#0e6655" },
images: { background: "#16a085", border: "#0e6655" },
styles: { background: "#16a085", border: "#0e6655" },


// ROUTING / FLOW CONTROL

routes: { background: "#8e44ad", border: "#5e3370" },
router: { background: "#8e44ad", border: "#5e3370" },
navigation: { background: "#8e44ad", border: "#5e3370" },


// BUSINESS / DOMAIN / DATA

models: { background: "#27ae60", border: "#1e8449" },
entities: { background: "#27ae60", border: "#1e8449" },
services: { background: "#27ae60", border: "#1e8449" },
repositories: { background: "#27ae60", border: "#1e8449" },
db: { background: "#27ae60", border: "#1e8449" },

// MIDDLEWARE / LOGIC LAYER
middlewares: { background: "#9a8f2e", border: "#696014" },
guards: { background: "#9a8f2e", border: "#696014" },
interceptors: { background: "#9a8f2e", border: "#696014" },


// UTILITIES / HELPERS

utils: { background: "#e67e22", border: "#a04000" },
helpers: { background: "#e67e22", border: "#a04000" },
lib: { background: "#e67e22", border: "#a04000" },
hooks: { background: "#e67e22", border: "#a04000" },


// CONFIGURATION

config: { background: "#c0392b", border: "#78281f" },
configs: { background: "#c0392b", border: "#78281f" },
env: { background: "#c0392b", border: "#78281f" },


// TESTING

tests: { background: "#7f8c8d", border: "#4d5656" },
__tests__: { background: "#7f8c8d", border: "#4d5656" },
specs: { background: "#7f8c8d", border: "#4d5656" },


// SCRIPTS / TOOLING

scripts: { background: "#d35400", border: "#873600" },
tools: { background: "#d35400", border: "#873600" },


// DOCUMENTATION / META

docs: { background: "#95a5a6", border: "#616a6b" },
".github": { background: "#95a5a6", border: "#616a6b" },
};

const DEFAULT_FOLDER_COLOR = {
background: "#34495e",
border: "#1c2833",
};

export function getFolderColor(folderName: string) {
return folderColors[folderName] ?? DEFAULT_FOLDER_COLOR;
}