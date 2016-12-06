const guid 			= require('guid'),
	  notesRepo		= require('../services/notes.repository'),
	  moment 		= require('moment');

module.exports = {
  showNotes: showNotes,
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

	notesRepo.saveNote(note, (err) => {  
		if(err) {
			// TODO: log error to error logging system
			
			return res.render('pages/500error', { 
		    	message: err.message
		    });
		}

		// set a successful flash message
	    req.flash('success', 'Successfuly created event!');

	    // redirect to the newly created event
	    res.redirect('/notes');
	});
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
			// updating that note
			note.noteBody        = req.body.noteBody;
			note.tags 			 = req.body.tags;
			note.updated 		 = new Date();

			notesRepo.saveNote(note, (err) => {
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

/**
 * Delete a note
 */
function deleteNote(req, res) {
	notesRepo.deleteNote(req.params.guid, (err) => {
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
