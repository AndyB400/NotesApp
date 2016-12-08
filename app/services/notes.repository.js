const fileUtils	= require('./fileUtils'),
	  fs 		= require('fs'),
	  jsonFile	= require('jsonFile'),
	  async 	= require('async'),
	  guid 		= require('guid');

module.exports = {
	listNotes: listNotes,
	saveNote: saveNote,
	findNote: findNote,
	deleteNote: deleteNote
}

/*
* Return a list of all the notes
*/
function listNotes(callback){
	
	fileUtils.checkDataDirectory(err => {  
		if(err) {
			console.log(`Unable to access path: ${fileUtils.dataPath}`, err);
			
			if(err.errno === -4058)
				err = new Error(`Unable to access path: ${fileUtils.dataPath}`);

			return callback(err, null);
		}

		fs.readdir(fileUtils.dataPath, (err, files) => {
			if (err) {
		    	console.log(`Unable to read directory: ${fileUtils.dataPath}`);

		    	return callback(err, null);
			}

			// Filter to only note files
		    files = files.filter(file => {
		    	 return file.substr(-5) === '.json' && file.substr(0, 5) === 'note_'; 
		    });

		    // Loop over each discovered file and map to a notes collection 
		    async.map(
			    // collection to iterate
			    files, 

			    // function to perform on each file
			    (file, transformedCallback) => {
			    	loadNoteFromFileName(fileUtils.createFilePathFromFileName(file), (err, note) => {
						transformedCallback(err, note);
			    	}) 
		 		}, 

		 		// Final Callback, calls the listNotes callback and returns the newly created notes collection
		 		(err, notes) => {
		 			callback(err, notes);
		 		}
		 	);
	    });
    });
}

/*
* Save a note object to json file
* @param note - the note object to save
* @param callback - The callback that handles the response.
*/
function saveNote(note, callback){
	var fileName = fileUtils.createFilePathFromGuid(note.guid);
	console.log(`Saving file to: ${fileName}`);

	jsonFile.writeFile(fileName, note, err => {
	  callback(err);
	});
}


/*
* Delete a note from the file system 
* @param guid - the guid of the note to be deleted
*/
function deleteNote(guid, callback) {
	var fileName = fileUtils.createFilePathFromGuid(guid);

	fs.unlink(fileName, err => {
		callback(err);
	});
}


/*
* Loads a note from the file system 
* @param string identifier - either a guid or a filename
* @returns - The note object via the callback function
*/
function findNote(identifier, callback){
	var fileName = identifier;

	if(guid.isGuid(identifier)){
		fileName = fileUtils.createFilePathFromGuid(identifier);
	}

	loadNoteFromFileName(fileName, callback)
}

/*
* Loads a note from the file system 
* @param filename - the filename of the note to be loaded
* @returns - The note object via the callback function
*/
function loadNoteFromFileName(fileName, callback){
	//Read File
	jsonFile.readFile(fileName, (err, note) => {
		
		// Handle invalid guid (no file found)
		if(err && err.errno === -4058)
			err = new Error(`The specified note could not be found`);

		callback(err, note);
	});
}
