const spawn = require("child_process").spawn;

const child = spawn("chuck", [
	"../../util/chuck/fileReader.ck",
	"../../instruments/instrument-superclass.ck",
	"../../instruments/instrument1.ck",
	"main.ck"
]);

child.stdout.on('data', function (buffer) { console.log(buffer.toString()) });
child.stderr.on('data', function (buffer) { console.log(buffer.toString()) });