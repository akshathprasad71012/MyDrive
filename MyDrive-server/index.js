const express = require("express");
var path = require('path');
const formidable = require("formidable");
const fs = require('fs');
const multer = require("multer");


const app = express();
app.use("/file", express.static("F://"))

var address = "F:/MyDrive/data/"

app.get("/", (req, res)=>{
    res.sendFile(__dirname + '\\index.html');
})

app.get("/address", (req, res)=>{
    res.status(200).json(address);
})

app.post("/mkdir/:foldername", (req, res)=>{
    try{
        const fname = req.params.foldername;
        fs.mkdir(address + fname, (err)=>{
            if (err) throw err;
            res.write("Done");
            res.end();
        })
        res.status(200).json("Done");
    }catch(err){
        res.status(500).json(err);
    }
})

app.get("/rcd", (req, res)=>{
    var ads = "";
    const addr = address.split('/');
    if(addr.length <= 2){
        res.status(500).json("Cannot cd.. anymore");
    }else{

        
        for(let i=0;i<addr.length-2;i++){
            ads = ads + addr[i] + '/';
        }
        address = ads;
        res.status(200).json(ads);
    }
})

app.get("/ls/:addrs", (req, res)=>{
    try{
        var addr = req.params.addrs;
        addr = req.params.addrs.replaceAll("|", "/");
        //console.log(addr);
        
        fs.readdir(addr, {withFileTypes: true}, (err, files)=>{
            
            var fileList = [];
            files.forEach((file)=>{
                try{
                    statObj = fs.statSync(file.path + file.name);
                    fileList.push({...file, ...statObj})
                }catch(err){
                    fileList.push(file)
                }
                
            })
            //console.log(fileList[0]);
            res.status(200).json(fileList)
        })
    }catch(err){
        res.status(500).json(err);
    }
})

app.post("/cd/:foldername", (req, res)=>{
    var flag = true;
    try{
        fs.readdir(address, {withFileTypes: true}, (err, files)=>{
            if (err) throw err;
            files.forEach((lsitem)=>{
                //console.log(lsitem);
                if (lsitem.name === req.params.foldername && flag){
                    address = address + req.params.foldername + "/";
                    flag = false;
                    res.status(200).json(address);
                }
            });
            if(flag){
                res.status(404).json(req.params.foldername + " NOT FOUND!");
            }
            
        })
    }catch(err){
        res.status(500).json(err);
    }
    
    
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //console.log(file);
        return cb(null, "./uploads")
    },
    filename: function (req, file, cb){
        
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage})

app.post("/upload", upload.single("file"),  (req, res)=>{
    
    // console.log("---------------------------------");
    // console.log(req.body.address);
    // console.log(req.file);

    fs.copyFile(".\\" + req.file.path, req.body.address+"/"+req.file.filename, function(err){
        if (err) throw err;
        

    });
    fs.unlink(".\\" + req.file.path, (err)=>{
        if(err) throw err;
        res.status(200).json("Done");
    });
    // files = req.body.filetoupload;
    // addr = req.body.address;
    // try{
    //     fs.writeFile(addr, files, (err)=>{
    //         console.log(addr);
    //     })
    //     res.status(200).json("Done")
    // }catch(err){
    //     res.status(500).json(err);
    // }
    
})

// app.post("/", (req, res) => {
//     var addrs = req.params.addr.replaceAll("|", "/");
//     var form = new formidable.IncomingForm()
//     form.parse(req, function(err, fields, files){
//         console.log(files.filetoupload[0].filepath);
//         var oldpath = files.filetoupload[0].filepath;
//         var newpath = addrs + Date.now() + "_" + files.filetoupload[0].originalFilename;
//         // fs.rename(oldpath, newpath, function (err) {
//         //     if (err) throw err;
//         //     res.write('File uploaded and moved!');
//         //     res.end();
//         //   });

//         
//     })
    

//     res.sendFile(__dirname + '\\index.html');
// })

app.listen(8800, ()=>{
    console.log("Backend Started");
})