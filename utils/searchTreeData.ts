import axios from "axios";

export const searchTreeData = async () => {
    const treeData = await axios.get(
        "https://api.github.com/repos/SahilSharma1212/chat/git/trees/main?recursive=1"
        );

    return treeData.data.tree;
};
