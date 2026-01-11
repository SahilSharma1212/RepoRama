// folderColors.ts

export interface FolderColor {
    background: string;
    border: string;
    icon:string
}

export const folderColors: Record<string, FolderColor> = {
    // CORE / ENTRY / SOURCE
    src: { background: "#3498db", border: "#1f5f8b", icon: "#6cbcff" },
    app: { background: "#3498db", border: "#1f5f8b", icon: "#6cbcff" },
    core: { background: "#3498db", border: "#1f5f8b", icon: "#6cbcff" },

    // UI / PRESENTATION
    components: { background: "#2980b9", border: "#1c5980", icon: "#5dade2" },
    pages: { background: "#2980b9", border: "#1c5980", icon: "#5dade2" },
    screens: { background: "#2980b9", border: "#1c5980", icon: "#5dade2" },
    views: { background: "#2980b9", border: "#1c5980", icon: "#5dade2" },
    layouts: { background: "#2980b9", border: "#1c5980", icon: "#5dade2" },

    // STATIC / ASSETS
    public: { background: "#16a085", border: "#0e6655", icon: "#5fffd2" },
    assets: { background: "#16a085", border: "#0e6655", icon: "#5fffd2" },
    static: { background: "#16a085", border: "#0e6655", icon: "#5fffd2" },
    images: { background: "#16a085", border: "#0e6655", icon: "#5fffd2" },
    styles: { background: "#16a085", border: "#0e6655", icon: "#5fffd2" },

    // ROUTING / FLOW CONTROL
    routes: { background: "#8e44ad", border: "#5e3370", icon: "#d2a6ff" },
    router: { background: "#8e44ad", border: "#5e3370", icon: "#d2a6ff" },
    navigation: { background: "#8e44ad", border: "#5e3370", icon: "#d2a6ff" },

    // BUSINESS / DOMAIN / DATA
    models: { background: "#27ae60", border: "#1e8449", icon: "#6dff9c" },
    entities: { background: "#27ae60", border: "#1e8449", icon: "#6dff9c" },
    services: { background: "#27ae60", border: "#1e8449", icon: "#6dff9c" },
    repositories: { background: "#27ae60", border: "#1e8449", icon: "#6dff9c" },
    db: { background: "#27ae60", border: "#1e8449", icon: "#6dff9c" },

    // MIDDLEWARE / LOGIC
    middlewares: { background: "#9a8f2e", border: "#696014", icon: "#fff27a" },
    guards: { background: "#9a8f2e", border: "#696014", icon: "#fff27a" },
    interceptors: { background: "#9a8f2e", border: "#696014", icon: "#fff27a" },

    // UTILITIES / HELPERS
    utils: { background: "#e67e22", border: "#a04000", icon: "#ffb86c" },
    helpers: { background: "#e67e22", border: "#a04000", icon: "#ffb86c" },
    lib: { background: "#e67e22", border: "#a04000", icon: "#ffb86c" },
    hooks: { background: "#e67e22", border: "#a04000", icon: "#ffb86c" },

    // CONFIGURATION
    config: { background: "#c0392b", border: "#78281f", icon: "#ff7b6e" },
    configs: { background: "#c0392b", border: "#78281f", icon: "#ff7b6e" },
    env: { background: "#c0392b", border: "#78281f", icon: "#ff7b6e" },

    // TESTING
    tests: { background: "#7f8c8d", border: "#4d5656", icon: "#e5e5e5" },
    __tests__: { background: "#7f8c8d", border: "#4d5656", icon: "#e5e5e5" },
    specs: { background: "#7f8c8d", border: "#4d5656", icon: "#e5e5e5" },

    // SCRIPTS / TOOLING
    scripts: { background: "#d35400", border: "#873600", icon: "#ff9f4d" },
    tools: { background: "#d35400", border: "#873600", icon: "#ff9f4d" },

    // DOCUMENTATION / META
    docs: { background: "#95a5a6", border: "#616a6b", icon: "#eaecee" },
    ".github": { background: "#95a5a6", border: "#616a6b", icon: "#eaecee" },
};

const DEFAULT_FOLDER_COLOR = {
    background: "#34495e",
    border: "#1c2833",
    icon:"#34495e"
};

export function getFolderColor(folderName: string) {
    return folderColors[folderName] ?? DEFAULT_FOLDER_COLOR;
}
