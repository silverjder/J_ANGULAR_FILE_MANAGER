using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace J_ANGULAR_FILE_MANAGER.Models.FileFs
{
    public class FilesF
    {
        public class TreeNode
        {
            public string Name { get; set; } = "";
            public string Fullname { get; set; } = "";
            public string Label { get; set; } = "";
            public string Data { get; set; } = "";
            public string Expandedicon { get; set; } = "fa-folder-open";
            public string Collapsedicon { get; set; } = "fa-folder";
            public bool Leaf { get; set; } = false;
            public string Icon { get; set; } = "fa-folder";
            public List<TreeNode> Children { get; set; }
            public TreeNode(string NAME, string FullName)
            {
                Children = new List<TreeNode>();
                this.Name = NAME;
                this.Fullname = FullName;
                Label = NAME;
                Data = FullName;
            }
        }
        public class FilesList
        {
            public string Label { get; set; } = "";
            public string Data { get; set; } = "";
            public string Size { get; set; } = "";
            public string Expandedicon { get; set; } = "";
            public string Collapsedicon { get; set; } = "";
            public bool Leaf { get; set; } = false;
            public string Icon { get; set; } = "";
            public string Typem { get; set; } = "";
            public string Datem { get; set; } = "";

            public FilesList()
            {
            }
        }


        public class RetList
        {
            public string Isfolder { get; set; }
            public List<FilesList> Records { get; set; }
            public RetList(string Isfolder_, List<FilesList> Records_)
            {
                Isfolder = Isfolder_;
                Records = Records_;
            }
        }
    }
}
