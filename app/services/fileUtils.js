module.exports = {
	createFileName: createFileName
}

/*
* Creates the string file name for notes based on their GUID
* @param guid - the guid of the note object to save
* @returns - The string file name e.g. 'note_bf0e49eb-116a-4f41-3987-57df72f615f7.json'
*/
function createFileName(guid){
	return path.join(dataPath, `note_${guid}.json`);
}
