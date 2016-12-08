const guid 			= require('guid'),
	  notesRepo		= require('../services/notes.repository'),
	  moment 		= require('moment');

module.exports = {
  showNotes: showNotes,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
  deleteNote: deleteNote,
  //seedNotes: seedNotes // Only for testing
}

/*
 * Show all notes
 */
function showNotes(req, res) {

	notesRepo.listNotes((err, notes) => {
		
		if(err) {
			// TODO: log error to error logging system
			
			return res.render('pages/500error', { 
		    	message: err.message
		    });
		}

		// return a view with data
	    res.render('pages/notes', { 
	      notes: notes,
	      success: req.flash('success'),
	      moment: moment
	    });
	});
}

/**
 * Show the create form
 */
function showCreate(req, res) {
	res.render('pages/create', {
		errors: req.flash('errors'),
		tags: req.flash('tags')
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
		req.flash('tags', req.body.tags);
		return res.redirect('/notes/create');
	}

	// create a new note
	var note = createNote(req.body.noteBody, req.body.tags);

	notesRepo.saveNote(note, err => {  
		if(err) {
			// TODO: log error to error logging system
			
			return res.render('pages/500error', { 
		    	message: err.message
		    });
		}

		// set a successful flash message
	    req.flash('success', 'Successfuly created note!');

	    // redirect to the newly created note
	    res.redirect('/notes');
	});
}

/*
* Creates a note oject and setups up the Guid and initial dates
* @param noteBody - the body of the new note
* @param tags - Any tags of the new note
*/
function createNote(noteBody, tags){
	return {
		guid: guid.raw(),
		noteBody: noteBody,
		tags: tags,
		created: new Date(),
		updated: new Date()
	};
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
	notesRepo.findNote(req.params.guid, (err, note) => {
		if(err) {
			// TODO: log error to error logging system
			
			return res.render('pages/500error', { 
		    	message: err.message
		    });
		}

		// return a view with data
	    res.render('pages/edit', { 
	    	note: note,
	    	errors: req.flash('errors'),
			moment: moment
	    });
	});
}

/**
 * Process the edit form
 */
function processEdit(req, res) {
  // validate information
	req.checkBody('noteBody', 'Note is required.').notEmpty();

	// if there are errors, redirect and save errors to flash
	const errors = req.validationErrors();
	if (errors) {
		req.flash('errors', errors.map(err => err.msg));
		return res.redirect(`/notes/${req.params.guid}/edit`);
	}

	// finding a current note
	notesRepo.findNote(req.params.guid, (err, note) => {  
		if(err) {
			// TODO: log error to error logging system
			
			return res.render('pages/500error', { 
		    	message: err.message
		    });
		} else {
			// update the note details
			note = updateNote(req.body.noteBody, req.body.tags);

			notesRepo.saveNote(note, err => {
				if(err) {
					// TODO: log error to error logging system
					
					return res.render('pages/500error', { 
				    	message: err.message
				    });
				}

				// success flash message
				// redirect back to the /notes
				req.flash('success', 'Successfully updated note.');
				res.redirect('/notes');
			});
		}
	});
}

/*
* Updates a note oject and sets the updated date
* @param noteBody - the body of the updated note
* @param tags - Any tags of the updated note
*/
function updateNote(note, noteBody, tags){
	note.noteBody = noteBody;
	note.tags 	  = tags;
	note.updated  = new Date();
	return note;
}


/**
 * Delete a note
 */
function deleteNote(req, res) {
	notesRepo.deleteNote(req.params.guid, err => {
		if(err) {
			// TODO: log error to error logging system
			
			return res.render('pages/500error', { 
		    	message: err.message
		    });
		}

		// set flash data
		// redirect back to the notes page
		req.flash('success', 'Note deleted!');
		res.redirect('/notes');
	});
}


/**
 * Seeds a collection of notes for testing
 */
function seedNotes(req, res) {
	
	for(var i=0;i<10000;i++){
		let randonNote = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		let randonTag = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

		let note = createNote(randonNote, randonTag);

		notesRepo.saveNote(note, err => {});
	}

	// set flash data
	// redirect back to the notes page
	req.flash('success', 'Notes seeded!');
	res.redirect('/notes');
}
