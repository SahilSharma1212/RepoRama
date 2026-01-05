export interface NodeColor {
background: string;
border: string;
}
export const fileColors: Record<string, NodeColor> = {

// JAVASCRIPT / TYPESCRIPT

js: { background: "#b4a200", border: "#9a8f2e" },
jsx: { background: "#1b9cc4", border: "#0b6f8e" },
ts: { background: "#3178c6", border: "#1f4f87" },
tsx: { background: "#3178c6", border: "#1f4f87" },


// PYTHON / DATA / ML

py: { background: "#3572A5", border: "#234a6f" },
ipynb: { background: "#f37626", border: "#9c4b12" }, // Jupyter Notebook
r: { background: "#198ce7", border: "#0f5c9c" },// R language


// JVM ECOSYSTEM

java: { background: "#b07219", border: "#6e450f" },
kt: { background: "#a97bff", border: "#6b4fb3" }, // Kotlin
kts: { background: "#a97bff", border: "#6b4fb3" },
scala: { background: "#dc322f", border: "#8b1f1d" },


// SYSTEM / LOW LEVEL

c: { background: "#555555", border: "#2e2e2e" },
cpp: { background: "#00599c", border: "#003f6f" },
h: { background: "#555555", border: "#2e2e2e" },
rs: { background: "#dea584", border: "#9b6b50" }, // Rust
go: { background: "#00ADD8", border: "#006f8c" },


// WEB / MARKUP

html: { background: "#e34c26", border: "#8f2d15" },
css: { background: "#563d7c", border: "#352554" },
scss: { background: "#c6538c", border: "#7a3556" },
xml: { background: "#0060ac", border: "#003f73" },
svg: { background: "#ff9900", border: "#a66300" },


// CONFIG / DATA

json: { background: "#292929", border: "#111111" },
yaml: { background: "#cb171e", border: "#7d0f13" },
yml: { background: "#cb171e", border: "#7d0f13" },
toml: { background: "#9c4221", border: "#5e2814" },
ini: { background: "#6d6d6d", border: "#3d3d3d" },


// DEVOPS / CLOUD

sh: { background: "#89e051", border: "#4e8c2a" },
bash: { background: "#89e051", border: "#4e8c2a" },
dockerfile: { background: "#0db7ed", border: "#087aa1" },
tf: { background: "#844fba", border: "#523173" }, // Terraform
tfvars: { background: "#844fba", border: "#523173" },


// DOCUMENTATION

md: { background: "#083fa1", border: "#052b6e" },
txt: { background: "#7f8c8d", border: "#4f5b5c" },
pdf: { background: "#b30b00", border: "#6e0700" },


// DATABASE

sql: { background: "#e38c00", border: "#925a00" },


// OTHER LANGUAGES

php: { background: "#4F5D95", border: "#2f375f" },
rb: { background: "#701516", border: "#3f0c0d" },
swift: { background: "#ffac45", border: "#b36f1f" },
};

