'use client'

import React, { useState } from "react";
import type { TreeNode } from "../../types";
import { Folder, FolderClosed, File } from "lucide-react";
import { fileColors } from "@/app/_utils/fileColors";
import { getFolderColor } from "@/app/_utils/folderColors";
import { useDataStore } from "@/app/store/dataStore";
interface FolderTreeProps {
  treeData: TreeNode[];
  level?: number;
}

function normalizeFolderName(name: string) {
  return name
    .toLowerCase()
    .replace(/\d+/g, '')      // remove numbers (folder1, folder2)
    .replace(/[-_]/g, '')     // remove - and _
    .trim()
}


function getFileExtension(name: string) {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

const FolderTree: React.FC<FolderTreeProps> = ({ treeData, level = 0 }) => {
  return (
    <ul className={`pl-${level * 4} space-y-1`}>
      {treeData.map((node) => (
        <TreeNodeItem key={node.path} node={node} level={level} />
      ))}
    </ul>
  );
};

const TreeNodeItem: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
  const [expanded, setExpanded] = useState(false)
  const isDir = node.type === 'dir'
  const normalizedName = isDir ? normalizeFolderName(node.name) : ""
  const folderColor = isDir ? getFolderColor(normalizedName) : null
  const fileExt = !isDir ? getFileExtension(node.name) : null
  const fileColor = fileExt ? fileColors[fileExt] : null
  const { setSelectedNode } = useDataStore();
  return (
    <li className="flex flex-col text-gray-300">
      <div
        className="flex items-center cursor-pointer hover:bg-[#222] px-5 py-1 rounded"
        style={{ paddingLeft: level * 16 }}
        onClick={() => {
          setSelectedNode(node);
          if (isDir) setExpanded(!expanded);
        }}
      >
        {isDir ? (
          expanded ? (
            <FolderClosed
              className="mr-2"
              style={{
                color: folderColor ? folderColor.icon : "#555",
                stroke: folderColor ? folderColor.icon : "#555",
              }}
            />
          ) : (
            <Folder
              className="mr-2"
              style={{
                color: folderColor!.background,
                stroke: folderColor!.border,
              }}
            />
          )
        ) : (
          <File
            className="mr-2"
            style={{
              color: fileColor?.icon ?? '#888',
              stroke: fileColor?.icon ?? '#555',
            }}
          />
        )}


        {node.name}
      </div>

      {isDir && expanded && node.children.length > 0 && (
        <FolderTree treeData={node.children} level={level + 1} />
      )}
    </li>
  )
}


export default FolderTree;
