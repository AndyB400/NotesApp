const path 		= require('path'),
	  fs 		= require('fs'),
	  dataPath 	= path.resolve('./', '..') + process.env.DATA_DIRECTORY;// '\\data';




module.exports = {
	createFilePathFromGuid: createFilePathFromGuid,
	createFilePathFromFileName: createFilePathFromFileName,
	checkDataDirectory: checkDataDirectory,
	dataPath: dataPath
}

/*
* Creates the string file name for notes based on their GUID
* @param guid - the guid of the note object to save
* @returns - The string file name e.g. 'note_bf0e49eb-116a-4f41-3987-57df72f615f7.json'
*/
function createFilePathFromGuid(guid){
	return path.join(dataPath, `note_${guid}.json`);
}

/*
* Creates the string file name for notes based on their GUID
* @param guid - the guid of the note object to save
* @returns - The string file name e.g. 'note_bf0e49eb-116a-4f41-3987-57df72f615f7.json'
*/
function createFilePathFromFileName(filename){
	return path.join(dataPath,filename);
}


/*
* Checks if a directory exists, and create it if it doesn't
* @param directory - the path of the directory to check
*/
function checkDataDirectory(callback) {  
	fs.stat(dataPath, (err, stats) => {
		//Check if error defined and the error code is "not exists"
		if (err && err.errno === 34) {
		  //Create the directory, call the callback.
		  fs.mkdir(dataPath, callback);
		} else {
		  //just in case there was a different error:
		  callback(err)
		}
	});
}