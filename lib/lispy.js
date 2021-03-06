// Generated by LispyScript v0.1.6
require("./node");
var fs = require("fs");
var path = require("path");
var ls = require("../lib/ls");
var repl = require("./repl");
var exit = function(error) {
    return error ?
        (function() {
            console.log(error);
            return process.exit(1);
        })() :
        process.exit(0);
};
var compileFiles = function(input,output) {
    return compile(fs.createReadStream(input),fs.createWriteStream(output),path.resolve(input));
};
var compile = function(input,output,uri) {
    var source = "";
    input.on("data",function(chunck) {
        return source = (source + chunck.toString());
    });
    input.on("end",function() {
        var jscode = (function () {
                try {
                    return output.write(ls._compile(source,uri));

                } catch (e) {
                        return (exit)(e);
                }
        })();
    });
    input.on("error",exit);
    return output.on("error",exit);
};
exports.run = function() {
    (process.argv.length === 2) ?
        (function() {
            process.stdin.resume();
            process.stdin.setEncoding("utf8");
            compile(process.stdin,process.stdout,process.cwd());
            setTimeout(function() {
                return (process.stdin.bytesRead === 0) ?
                    (function() {
                        process.stdin.removeAllListeners("data");
                        return repl.runrepl();
                    })() :
                    undefined;
            },20);
        })() :
        (process.argv.length === 3) ?
            (function() {
                var i = process.argv[2];
                var o = i.replace(".ls",".js");
                return (i === o) ?
                    console.log("Input file must have extension '.ls'") :
                    compileFiles(i,o);
            })() :
            compileFiles(process.argv[2],process.argv[3]);
};
