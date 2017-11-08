using J_ANGULAR_FILE_MANAGER.Models.MimeTypes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static J_ANGULAR_FILE_MANAGER.Models.FileFs.FilesF;

namespace J_ANGULAR_FILE_MANAGER.Controllers
{ 
    [Route("api/[controller]")]
    public class JfilesController : Controller
    {
        private string assets = "assets";
        private string pathroot = "www"; 
        private ILogger<JfilesController> _logger;
        private IHostingEnvironment _env;
        private List<string> Mine { get; set; } = new List<string>
            (new string[] { "bmp", "gif", "ico", "jpg", "jpeg", "png", "ogg", "mp3", "aac", "wma", "wav", "mp4", "mpg", "mpeg", "webm", "hwp", "pdf", "xls", "doc", "ppt", "xlsx", "docx", "pptx", "txt", "pdf", "old", "zip" });


        public JfilesController( ILogger<JfilesController> logger
            , IHostingEnvironment env)
        { 
            _logger = logger;
            _env = env;
        }




        [HttpGet]
        public IActionResult Get()
        {  
            try
            {
                var webRoot = _env.WebRootPath + "/" + assets + "/" + pathroot + "/dbimage";
                if (!Directory.Exists(webRoot))
                {
                    Directory.CreateDirectory(webRoot);
                }

                if (Directory.Exists(webRoot))
                {
                    var child = AddNodeAndDescendents(new DirectoryInfo(webRoot), null);
                    return Ok(child);
                }
                else
                {
                    return BadRequest();
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"There was an error: {ex.Message}");
                return BadRequest();
            }
        }

        private TreeNode AddNodeAndDescendents(DirectoryInfo folder, TreeNode parentNode)
        {
            string virtualFolderPath;

            if (parentNode == null)
            {
                virtualFolderPath = folder.Name;
            }
            else
            {
                virtualFolderPath = $"{parentNode.Data }/{folder.Name}";
            }

            var node = new TreeNode(folder.Name, virtualFolderPath);

            var subFolders = folder.GetDirectories();

            foreach (DirectoryInfo subFolder in subFolders)
            {
                var child = AddNodeAndDescendents(subFolder, node);
                node.Children.Add(child);
            }
            return node;
        }


        /// <summary>
        /// files list
        /// </summary>
        /// <param name="models"></param>
        /// <returns></returns>
        [HttpPost("list")]
        public IActionResult GetList([FromBody] FilesList models)
        { 
             
            #region
            try
            {
                if (models == null)
                {
                    models = new FilesList()
                    {
                        Data = "dbimage"
                    };
                }
                if (models.Data.Equals(null) || models.Data.Equals(""))
                {
                    models.Data = "dbimage";
                };


                var webRoot = $"{_env.WebRootPath}/{assets}/{pathroot}";
                var base_folder = "";
                if (Directory.Exists(webRoot))
                {
                    DirectoryInfo di0 = new DirectoryInfo(webRoot);
                    base_folder = di0.FullName;
                }


                List<FilesList> model = new List<FilesList>();
                DirectoryInfo di = new DirectoryInfo(webRoot + "/" + models.Data);
                foreach (DirectoryInfo sdi in di.GetDirectories())
                {
                    //sdi.FullName;
                    model.Add(
                        new FilesList()
                        {
                            Label = sdi.Name,
                            Data = (sdi.FullName.Replace(base_folder + "\\", "").Replace(base_folder + "/", "")).Replace("\\", "/"),
                            Size = "",
                            Leaf = true,
                            Typem = "File Folder",
                            Datem = sdi.LastWriteTimeUtc.ToString()
                        });
                }
                foreach (FileInfo fi in di.GetFiles())
                {
                    //fi.FullName;
                    model.Add(
                        new FilesList()
                        {
                            Label = fi.Name,
                            Data = (fi.FullName.Replace(base_folder + "\\", "").Replace(base_folder + "/", "")).Replace("\\", "/"),
                            Size = SIZE_FILE(fi.Length),
                            Leaf = false,
                            Typem = "File",
                            Datem = fi.LastWriteTimeUtc.ToString()
                        });
                }
                return Ok(new RetList(models.Data, model)); //200 ok    
            }
            catch (Exception ex)
            {
                _logger.LogError($"There was an error: {ex.Message}");
                return BadRequest();
            }
            #endregion
        }

        private string SIZE_FILE(double fsize)
        {
            double retval = 0; string retstr = "";
            if (fsize > (1024 * 1024 * 1024))
            {
                retval = Math.Round(fsize / (1024 * 1024 * 1024));
                retstr = retval + "GB";
            }
            else if (fsize > (1024 * 1024))
            {
                retval = Math.Round(fsize / (1024 * 1024));
                retstr = retval + "MB";
            }
            else if (fsize > 1024)
            {
                retval = Math.Round(fsize / 1024);
                retstr = retval + "KB";
            }
            else
            {
                retstr = "1KB";
            }
            return retstr;
        }

        [HttpDelete("del")]
        public IActionResult Delete([FromBody] FilesList models)
        {  
            #region 
            try
            {
                if (models == null) { models = new FilesList() { }; };
                if (!models.Data.Equals(null) && !models.Data.Equals(""))
                {
                    var webRoot = _env.WebRootPath + "/" + assets + "/" + pathroot + "/" + models.Data;

                    if (models.Leaf)
                    {
                        if (Directory.Exists(webRoot))
                        {
                            DirectoryInfo directory = new DirectoryInfo(webRoot);
                            List<FileInfo> fileInfos = directory.EnumerateFiles("*.*", SearchOption.AllDirectories).ToList();
                            foreach (FileInfo f in fileInfos) f.Delete();
                            directory.Delete(true);
                        }

                    }
                    else
                    {
                        FileInfo f1 = new FileInfo(webRoot);
                        if (f1.Exists)
                        {
                            f1.Delete();
                        }
                    };
                    models.Icon = "DELETE";
                }
                return Ok(models);
            }
            catch (Exception ex)
            {
                _logger.LogError($"You can not delete it.:{ex.Message}");// 400 bad request
                return BadRequest();
            }
            #endregion
        }





        [HttpPost("[action]")]
#pragma warning disable CS1998 // 이 비동기 메서드에는 'await' 연산자가 없으며 메서드가 동시에 실행됩니다.
        public async Task<IActionResult> UpLoad5()
#pragma warning restore CS1998 // 이 비동기 메서드에는 'await' 연산자가 없으며 메서드가 동시에 실행됩니다.
        {  
            FilesList models = new FilesList();
            var files = Request.Form.Files;
            long size = 0;
            string filename = "", Mine = "";
            foreach (var file in files)
            {
                filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.ToString().Trim().Replace("\"", "");
                Mine = filename.IndexOf('.') > -1 ? filename.Substring(filename.LastIndexOf('.') + 1) : "";
                if (Mine.Contains(Mine)) //컨텐츠 허용 확장자
                {
                    filename = _env.WebRootPath + "/" + assets + "/" + pathroot
                        + "/" + (file.Name.Equals("") ? "dbiamge" : file.Name)
                        + "/" + filename.Replace("\"", "");
                    size += file.Length;

                    using (FileStream fs = System.IO.File.Create(filename.ToString()))
                    {
                        file.CopyTo(fs);
                        fs.Flush();
                    }
                }
            }
            models.Size = size.ToString();
            models.Label = files.Count() + "";
            return Ok(models);
        }


        /// <summary>
        /// 신규 파일 생성
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("[action]")]
        [Consumes("application/json")]
        public IActionResult NewFolder([FromBody]FilesList model)
        { 
            try
            {
                model.Label = model.Label.Replace(" ", "").Trim();
                model.Label = Regex.Replace(model.Label, @"[^a-zA-Z0-9가-힣_]", "", RegexOptions.Singleline);
                model.Icon = _env.WebRootPath;

                var webRoot = _env.WebRootPath + "/" + assets + "/" + pathroot + "/" + model.Data + "/" + model.Label;

                if (!Directory.Exists(webRoot))
                {
                    Directory.CreateDirectory(webRoot);
                    model.Typem = "1";
                }
                else
                {
                    model.Typem = "2";
                }
                return Ok(model);
            }
            catch (Exception ex)
            {
                _logger.LogError($"There was an error: {ex.Message}");
                return BadRequest();
            }
        }


        /// <summary>
        /// 파일명 변경
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("[action]")]
        [Consumes("application/json")]
        public IActionResult ReName([FromBody]FilesList model)
        {  
            try
            {
                model.Label = (model.Label.IndexOf('.') > -1 ? model.Label.Substring(0, model.Label.LastIndexOf('.')) : model.Label).Trim();
                model.Label = Regex.Replace(model.Label, @"[^a-zA-Z0-9가-힣_]", "", RegexOptions.Singleline);

                if (model.Typem.Equals("file"))
                {
                    #region file
                    model.Label += model.Icon != null && model.Icon.IndexOf('.') > -1
                        ? model.Icon.Substring(model.Icon.LastIndexOf('.')) : "";

                    var webRoot = _env.WebRootPath + "/" + assets + "/" + pathroot + "/" + model.Data;
                    var webRoot2 = _env.WebRootPath + "/" + assets + "/" + pathroot + "/"
                        + (model.Data.IndexOf('\\') > -1
                        ? model.Data.Substring(0, model.Data.LastIndexOf('\\'))
                        : model.Data.Substring(0, model.Data.LastIndexOf('/')))
                        + '/' + model.Label;

                    if (new FileInfo(webRoot).Exists && !new FileInfo(webRoot2).Exists)
                    {
                        model.Typem = "1";
                        var file = new FileInfo(webRoot);
                        file.MoveTo(webRoot2);
                    }
                    else
                    {
                        model.Typem = "2";
                    }
                    #endregion
                }
                else
                {
                    #region
                    var webRoot = _env.WebRootPath + "/" + assets + "/" + pathroot + "/" + model.Data;
                    var webRoot2 = _env.WebRootPath + "/" + assets + "/" + pathroot + "/"

                        + (model.Data.IndexOf('\\') > -1
                        ? model.Data.Substring(0, model.Data.LastIndexOf('\\'))
                        : model.Data.Substring(0, model.Data.LastIndexOf('/')))
                        + '/' + model.Label
                        ;
                    if (Directory.Exists(webRoot) && !Directory.Exists(webRoot2))
                    {
                        model.Typem = "1";
                        var file = new DirectoryInfo(webRoot);
                        file.MoveTo(webRoot2);
                    }
                    else
                    {
                        model.Typem = "2";
                    }
                    #endregion
                }

                return Ok(model);

            }
            catch (Exception ex)
            {
                _logger.LogError($"There was an error: {ex.Message}");
                return BadRequest();
            }
        }



        [HttpPost("[action]")]
        public ActionResult GetFileE([FromBody]FilesList model)
        {  
            String path = _env.WebRootPath + "/" + assets + "/" + pathroot + "/" + model.Data; 
            if (model.Typem.Equals("file"))
            {
                #region
                var file = new FileInfo(path);
                if (file.Exists)
                {
                    try
                    {
                        string ico = model.Data.IndexOf(".") > -1 ? MimeTypeMap.GetMimeType(model.Data.Substring(model.Data.LastIndexOf('.') + 1)) + "" : "";
                        model.Label = (model.Label.IndexOf('.') > -1 ? model.Label.Substring(0, model.Label.LastIndexOf('.')) : model.Label).Trim();
                        model.Label = Regex.Replace(model.Label, @"[^a-zA-Z0-9가-힣_]", "", RegexOptions.Singleline);
                        model.Label += model.Data != null && model.Data.IndexOf('.') > -1 ? model.Data.Substring(model.Data.LastIndexOf('.')) : "";
                        model.Label = System.Net.WebUtility.UrlEncode(model.Label);
                        Response.Headers.Add("content-disposition", "attachment; filename=\"" + model.Label + "\"");
                        Response.Headers.Add("x-file", ico);
                        var stream = new FileStream(path, FileMode.Open);
                        return new FileStreamResult(stream, ico) { FileDownloadName = model.Label };
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"There was an error: {ex.Message}");
                        return null;
                    }
                }
                else
                {
                    return null;
                }
                #endregion
            }
            else
            {
                return null;
            }
        }




        [HttpPost("[action]")]
        #pragma warning disable CS1998 // 이 비동기 메서드에는 'await' 연산자가 없으며 메서드가 동시에 실행됩니다.
        public async Task<IActionResult> UploadImg()
        #pragma warning restore CS1998 // 이 비동기 메서드에는 'await' 연산자가 없으며 메서드가 동시에 실행됩니다.
        {  
            FilesList models = new FilesList();
            var files = Request.Form.Files;
            long size = 0;
            string filename = "", filenameBN2 = "", tempfileName = ""
                , baseFolder1 = $"/{assets}/{pathroot}/dbimage/image/{System.DateTime.UtcNow.ToString("yyyyMMdd")}"
                , baseFolder2 = $"{_env.WebRootPath}/{assets}/{pathroot}/dbimage/image/{System.DateTime.UtcNow.ToString("yyyyMMdd")}"
                , Mine = "";
            int counter = 2;
            List<string> MineE = new List<string>(new string[] { "bmp", "gif", "ico", "jpg", "jpeg", "png" });

            foreach (var file in files)
            {
                filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.ToString().Trim().Replace("\"", "");
                Mine = filename.IndexOf('.') > -1 ? filename.Substring(filename.LastIndexOf('.') + 1) : "";
                if (MineE.Contains(Mine)) //컨텐츠 허용 확장자
                {
                    if (!Directory.Exists(baseFolder2)) { Directory.CreateDirectory(baseFolder2); };

                    filenameBN2 = baseFolder2 + "/" + filename;
                    models.Label = $"{baseFolder1 }/{filename}";
                    if (System.IO.File.Exists(filenameBN2))
                    {
                        counter = 2;
                        while (System.IO.File.Exists(filenameBN2))
                        {
                            tempfileName = counter.ToString() + filename;
                            filenameBN2 = baseFolder2 + "/" + tempfileName;
                            models.Label = $"{baseFolder1 }/{tempfileName}";
                            counter++;
                        }
                        filename = counter.ToString() + filename;
                    }
                    size += file.Length;
                    using (FileStream fs = System.IO.File.Create(filenameBN2.ToString()))
                    {
                        file.CopyTo(fs);
                        fs.Flush();
                    }
                }
            }
            models.Size = size.ToString();
            models.Icon = files.Count() + "";
            return Ok(models);
        }
    }
}
