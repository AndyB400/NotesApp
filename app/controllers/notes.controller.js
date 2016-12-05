const fs 			= require('fs'),
	  jsonFile		= require('jsonFile'),
	  path 			= require('path')
	  guid 			= require('guid'),
	  notesRepo		= require('../services/notes.repository');

module.exports = {
  showNotes: showNotes,
  showSingle: showSingle,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
  deleteNote: deleteNote
}

/*
 * Show all notes
 */
function showNotes(req, res) {

	notesRepo.list((err, notes) => {
		// return a view with data
	    res.render('pages/notes', { 
	      notes: notes,
	      success: req.flash('success')
	    });
	});

	// checkDirectory(dataPath, (err) => {  
	// 	if(err) {
	// 		console.log(`Unable to access path: ${dataPath}`, err);
	// 	} 
	// 	else {
	    
	// 	    fs.readdir(dataPath, (err, files) => {
	// 			if (err) {
	// 		    	console.log(`Unable to read directory: ${dataPath}`);
	// 				res.send('Unable to load notes!');
	// 		    }

	// 		    var notes = [];
	// 		    for (var file of files){

	// 		    	loadNoteFromFileName(path.join(dataPath,file), (err, note) => {
	// 		    		if(err)
	// 		    			console.log(`Unable to load file:${file}`, err);
	// 		    		else
	// 		    			notes.push(note);
	// 		    	});
	// 		    }

	// 	    	console.log(notes.length);
	// 	    	// return a view with data
	// 		    res.render('pages/notes', { 
	// 		      notes: notes,
	// 		      success: req.flash('success')
	// 		    });
	// 	    });
	// 	}
	// });
}

/**
 * Show a single note
 */
function showSingle(req, res) {
	// get a single note
	jsonFile.readFile(dataPath + req.params.id + '.json', (err, note) => {
		if (err) {
			res.status(404);
			res.send('Note not found!');
		}

	    // Load from json

	    res.render('pages/single', { 
	      note: note,
	      success: req.flash('success')
	    });
	});
}

/**
 * Show the create form
 */
function showCreate(req, res) {
	res.render('pages/create', {
		errors: req.flash('errors')
	});
}

/**
 * Process the creation form
 */
function processCreate(req, res) {
	// validate information
	req.checkBody('noteBody', 'Note is required.').notEmpty();

	// if there are errors, redirect and save errors to flash
	const errors = req.validationErrors();
	if (errors) {
		req.flash('errors', errors.map(err => err.msg));
		return res.redirect('/notes/create');
	}

	// create a new note
	var note = {
		guid: guid.raw(),
		noteBody: req.body.noteBody,
		tags: req.body.tags,
		created: new Date(),
		updated: new Date()
	};

	//Save new note to json file
	saveNote(note, (err) => {  
		if(err) {
			console.log("Error when trying to save note.", err);
		} else {
			console.log('File Saved successfully');
		}
	});
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
	loadNote(req.params.guid, (err, note) => {  
		if(err) {
			console.log(`Error loading note ${guid} to edit.`, err);
		} else {
			res.render('pages/edit', {
				note: note,
				errors: req.flash('errors')
			});
		}
	});
}

/**
 * Process the edit form
 */
function processEdit(req, res) {
  // validate information
	req.checkBody('note', 'Note is required.').notEmpty();

	// if there are errors, redirect and save errors to flash
	const errors = req.validationErrors();
	if (errors) {
		req.flash('errors', errors.map(err => err.msg));
		return res.redirect(`/notes/${req.params.id}/edit`);
	}

	// finding a current note
	loadNote(req.params.guid, (err, note) => {  
		if(err) {
			console.log(`Error loading note ${guid} to edit.`, err);
		} else {
			// updating that note
			note.noteBody        = req.body.noteBody;
			note.tags 			 = req.body.tags;
			note.updated 		 = new Date();

			saveNote(note, (err) => {
				if (err)
					throw err;

				// success flash message
				// redirect back to the /notes
				req.flash('success', 'Successfully updated note.');
				res.redirect('/notes');
			});
		}
	});
}

/**
 * Delete a note
 */
function deleteNote(req, res) {
	Note.remove({ slug: req.params.slug }, (err) => {
		// set flash data
		// redirect back to the notes page
		req.flash('success', 'Note deleted!');
		res.redirect('/notes');
	});
}


/*
* Save a note object to json file
* @param note - the note object to save
* @param callback - The callback that handles the response.
*/
function saveNote(note, callback){
	var fileName = createFileName(note.guid);
	console.log(`Saving file to: ${fileName}`);

	jsonFile.writeFile(fileName, note, (err) => {
	  callback(err);
	});
}


/*
* Loads a note from the file system from its guid
* @param guid - the guid of the note object to be loaded
* @returns - The note object via the callback function
*/
function loadNote(guid, callback){
	var fileName = createFileName(guid);
	loadNoteFromFileName(fileName, callback);
}

/*
* Loads a note from the file system 
* @param filename - the filename of the note to be loaded
* @returns - The note object via the callback function
*/
function loadNoteFromFileName(fileName, callback){
	console.log(`Loading file: ${fileName}`);

	jsonFile.readFile(fileName, (err, note) => {
		if (err)
			console.log(`Error whilst loading file: ${fileName}`);

		callback(err, note);
	});
}