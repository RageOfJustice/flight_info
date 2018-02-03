const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

function copyFiles(pathName) {
	fs.copyFile(path.join(__dirname, "/dumps/index.jsx"), path.join( pathName, "index.jsx"), fs.constants.COPYFILE_EXCL, err => {
		if (err)
			console.log(err);
	});
	fs.copyFile(path.join(__dirname, "/dumps/style.sass"), path.join( pathName, "style.sass"), fs.constants.COPYFILE_EXCL, err => {
		if (err)
			console.log(err);
	});
}

args.forEach(name => {
	const pathName = path.resolve(__dirname, "../src/app/components", name);
	fs.access(pathName, err => {
		if (!err) {
			console.log(name + " already exists");
			copyFiles(pathName);
			return;
		}
		fs.mkdir(pathName, err => {
			if (err) {
				console.log(name + "cant be created");
				return;
			}
			copyFiles(pathName);
		});

	});
});


