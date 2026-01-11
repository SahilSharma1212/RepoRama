import { NodeColor } from "../types";

export const fileColors: Record<string, NodeColor> = {
    // JAVASCRIPT / TYPESCRIPT
    js: { background: "#b4a200", border: "#9a8f2e", icon: "#f7df1e" },
    jsx: { background: "#1b9cc4", border: "#0b6f8e", icon: "#61dafb" },
    ts: { background: "#3178c6", border: "#1f4f87", icon: "#4ea1ff" },
    tsx: { background: "#3178c6", border: "#1f4f87", icon: "#4ea1ff" },

    // PYTHON / DATA / ML
    py: { background: "#3572A5", border: "#234a6f", icon: "#ffd43b" },
    ipynb: { background: "#f37626", border: "#9c4b12", icon: "#ff9f43" },
    r: { background: "#198ce7", border: "#0f5c9c", icon: "#6cb6ff" },

    // JVM ECOSYSTEM
    java: { background: "#b07219", border: "#6e450f", icon: "#f89820" },
    kt: { background: "#a97bff", border: "#6b4fb3", icon: "#cfa9ff" },
    kts: { background: "#a97bff", border: "#6b4fb3", icon: "#cfa9ff" },
    scala: { background: "#dc322f", border: "#8b1f1d", icon: "#ff6b6b" },

    // SYSTEM / LOW LEVEL
    c: { background: "#555555", border: "#2e2e2e", icon: "#bbbbbb" },
    cpp: { background: "#00599c", border: "#003f6f", icon: "#4fc3ff" },
    h: { background: "#555555", border: "#2e2e2e", icon: "#bbbbbb" },
    rs: { background: "#dea584", border: "#9b6b50", icon: "#ffb86c" },
    go: { background: "#00ADD8", border: "#006f8c", icon: "#6fe8ff" },

    // WEB / MARKUP
    html: { background: "#e34c26", border: "#8f2d15", icon: "#ff8c66" },
    css: { background: "#563d7c", border: "#352554", icon: "#bfa8ff" },
    scss: { background: "#c6538c", border: "#7a3556", icon: "#ff9fcf" },
    xml: { background: "#0060ac", border: "#003f73", icon: "#4fa3ff" },
    svg: { background: "#ff9900", border: "#a66300", icon: "#ffd27d" },

    // CONFIG / DATA
    json: { background: "#292929", border: "#111111", icon: "#e5e5e5" },
    yaml: { background: "#cb171e", border: "#7d0f13", icon: "#ff6b6b" },
    yml: { background: "#cb171e", border: "#7d0f13", icon: "#ff6b6b" },
    toml: { background: "#9c4221", border: "#5e2814", icon: "#ff9b6b" },
    ini: { background: "#6d6d6d", border: "#3d3d3d", icon: "#dcdcdc" },

    // DEVOPS / CLOUD
    sh: { background: "#89e051", border: "#4e8c2a", icon: "#caff9a" },
    bash: { background: "#89e051", border: "#4e8c2a", icon: "#caff9a" },
    dockerfile: { background: "#0db7ed", border: "#087aa1", icon: "#6fdcff" },
    tf: { background: "#844fba", border: "#523173", icon: "#caa9ff" },
    tfvars: { background: "#844fba", border: "#523173", icon: "#caa9ff" },

    // DOCUMENTATION
    md: { background: "#083fa1", border: "#052b6e", icon: "#7aa7ff" },
    txt: { background: "#7f8c8d", border: "#4f5b5c", icon: "#e0e0e0" },
    pdf: { background: "#b30b00", border: "#6e0700", icon: "#ff5f5f" },

    // DATABASE
    sql: { background: "#e38c00", border: "#925a00", icon: "#ffd27d" },

    // OTHER LANGUAGES
    php: { background: "#4F5D95", border: "#2f375f", icon: "#9aa7ff" },
    rb: { background: "#701516", border: "#3f0c0d", icon: "#ff6b6b" },
    swift: { background: "#ffac45", border: "#b36f1f", icon: "#ffd38a" },
};
